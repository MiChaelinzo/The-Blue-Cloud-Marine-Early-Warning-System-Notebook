#!/usr/bin/env python3
"""
Blue-Cloud Notebook Conversion Utility

This script converts between Blue-Cloud web notebook format (JSON) and Jupyter notebook format (.ipynb).
It also provides utilities for exporting to other formats.

Usage:
    python convert_notebook.py --input notebook.json --output notebook.ipynb --format jupyter
    python convert_notebook.py --input notebook.ipynb --output notebook.json --format bluecloud
    python convert_notebook.py --input notebook.json --output notebook.py --format python
"""

import json
import argparse
import sys
from datetime import datetime
from pathlib import Path

try:
    import nbformat as nbf
    NBFORMAT_AVAILABLE = True
except ImportError:
    NBFORMAT_AVAILABLE = False
    print("Warning: nbformat not installed. Install with: pip install nbformat")

def convert_bluecloud_to_jupyter(bluecloud_data, output_file):
    """Convert Blue-Cloud notebook JSON to Jupyter .ipynb format"""
    if not NBFORMAT_AVAILABLE:
        raise ImportError("nbformat package required for Jupyter conversion")
    
    # Create new Jupyter notebook
    nb = nbf.v4.new_notebook()
    nb.metadata.title = bluecloud_data.get('name', 'Untitled Notebook')
    nb.metadata.bluecloud_origin = {
        'created': bluecloud_data.get('createdAt'),
        'updated': bluecloud_data.get('updatedAt'),
        'original_id': bluecloud_data.get('id')
    }
    
    # Add header cell with conversion info
    header_content = f"""# {bluecloud_data.get('name', 'Untitled Notebook')}

*Converted from Blue-Cloud Marine Notebook*  
*Original creation date: {bluecloud_data.get('createdAt', 'Unknown')}*  
*Conversion date: {datetime.now().isoformat()}*

---

**Note**: This notebook was converted from JavaScript to Python. Some functions may need manual adaptation.
"""
    nb.cells.append(nbf.v4.new_markdown_cell(header_content))
    
    # Add Python imports cell
    imports_content = """# Import required libraries for marine analysis
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Marine-specific libraries (install if needed)
try:
    import gsw  # Gibbs SeaWater package
    from geopy.distance import geodesic
    from scipy.stats import entropy
    print("✅ All marine analysis libraries loaded successfully!")
except ImportError as e:
    print(f"⚠️ Missing library: {e}")
    print("Install with: pip install gsw geopy scipy")

# Set plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("viridis")
"""
    nb.cells.append(nbf.v4.new_code_cell(imports_content))
    
    # Convert cells
    for cell in bluecloud_data.get('cells', []):
        if cell['type'] == 'code':
            # Convert JavaScript code to Python with comments
            js_code = cell['content']
            python_code = convert_js_to_python_comments(js_code)
            
            nb_cell = nbf.v4.new_code_cell(python_code)
            
            # Add execution count if available
            if 'metadata' in cell and 'executionCount' in cell['metadata']:
                nb_cell.execution_count = cell['metadata']['executionCount']
            
            # Add output if exists
            if 'output' in cell and cell['output']:
                output_content = cell['output']['content']
                if cell['output']['type'] == 'error':
                    nb_cell.outputs = [nbf.v4.new_output(
                        output_type='error',
                        ename='ConversionError',
                        evalue='Original JavaScript execution error',
                        traceback=[output_content]
                    )]
                else:
                    nb_cell.outputs = [nbf.v4.new_output(
                        output_type='stream',
                        name='stdout',
                        text=output_content
                    )]
        
        elif cell['type'] == 'markdown':
            nb_cell = nbf.v4.new_markdown_cell(cell['content'])
        
        nb.cells.append(nb_cell)
    
    # Save as .ipynb
    with open(output_file, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print(f"✅ Converted to Jupyter notebook: {output_file}")

def convert_jupyter_to_bluecloud(jupyter_file, output_file):
    """Convert Jupyter .ipynb to Blue-Cloud notebook JSON format"""
    if not NBFORMAT_AVAILABLE:
        raise ImportError("nbformat package required for Jupyter conversion")
    
    # Read Jupyter notebook
    with open(jupyter_file, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    # Create Blue-Cloud notebook structure
    now = datetime.now()
    bluecloud_notebook = {
        'id': f'converted-{int(now.timestamp())}',
        'name': nb.metadata.get('title', Path(jupyter_file).stem),
        'cells': [],
        'createdAt': now.isoformat(),
        'updatedAt': now.isoformat(),
        'metadata': {
            'language': 'javascript',
            'kernelName': 'javascript',
            'converted_from': 'jupyter',
            'original_kernel': nb.metadata.get('kernelspec', {}).get('name', 'unknown')
        }
    }
    
    # Convert cells
    for cell in nb.cells:
        if cell.cell_type == 'code':
            # Convert Python code to JavaScript with comments
            python_code = cell.source
            js_code = convert_python_to_js_comments(python_code)
            
            bluecloud_cell = {
                'id': f'cell-{len(bluecloud_notebook["cells"])}',
                'type': 'code',
                'content': js_code,
                'metadata': {}
            }
            
            # Add execution count if available
            if cell.execution_count:
                bluecloud_cell['metadata']['executionCount'] = cell.execution_count
            
            # Convert outputs if present
            if cell.outputs:
                output_text = []
                for output in cell.outputs:
                    if output.output_type == 'stream':
                        output_text.append(output.text)
                    elif output.output_type == 'execute_result':
                        if 'text/plain' in output.data:
                            output_text.append(output.data['text/plain'])
                    elif output.output_type == 'error':
                        output_text.append(f"Error: {output.evalue}")
                
                if output_text:
                    bluecloud_cell['output'] = {
                        'type': 'text',
                        'content': '\n'.join(output_text)
                    }
        
        elif cell.cell_type == 'markdown':
            bluecloud_cell = {
                'id': f'cell-{len(bluecloud_notebook["cells"])}',
                'type': 'markdown',
                'content': cell.source,
                'metadata': {}
            }
        
        else:
            continue  # Skip other cell types
        
        bluecloud_notebook['cells'].append(bluecloud_cell)
    
    # Save as JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(bluecloud_notebook, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Converted to Blue-Cloud notebook: {output_file}")

def convert_bluecloud_to_python(bluecloud_data, output_file):
    """Convert Blue-Cloud notebook to standalone Python script"""
    
    python_script = f'''#!/usr/bin/env python3
"""
{bluecloud_data.get('name', 'Untitled Notebook')}

Converted from Blue-Cloud Marine Notebook
Original creation date: {bluecloud_data.get('createdAt', 'Unknown')}
Conversion date: {datetime.now().isoformat()}

Note: This script was converted from JavaScript. Some functions may need manual adaptation.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Marine-specific libraries
try:
    import gsw  # Gibbs SeaWater package
    from geopy.distance import geodesic
    from scipy.stats import entropy
    print("✅ All marine analysis libraries loaded successfully!")
except ImportError as e:
    print(f"⚠️ Missing library: {{e}}")
    print("Install with: pip install gsw geopy scipy")

# Set plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("viridis")

'''
    
    # Add marine analyzer class
    python_script += '''
class MarineAnalyzer:
    """Marine data analysis functions - Python equivalent of Blue-Cloud notebook helpers"""
    
    @staticmethod
    def calculate_density(temperature, salinity, pressure=0):
        """Calculate seawater density using GSW library"""
        return gsw.rho(salinity, temperature, pressure)
    
    @staticmethod
    def find_thermocline_depth(temperature, depth):
        """Find thermocline depth from temperature gradient"""
        gradients = np.gradient(temperature, depth)
        thermocline_idx = np.argmin(gradients)
        return depth[thermocline_idx]
    
    @staticmethod
    def calculate_shannon_diversity(species_counts):
        """Calculate Shannon diversity index"""
        proportions = np.array(species_counts) / np.sum(species_counts)
        proportions = proportions[proportions > 0]
        return entropy(proportions, base=np.e)
    
    @staticmethod
    def calculate_distance(coord1, coord2):
        """Calculate distance between coordinates"""
        return geodesic(coord1, coord2).kilometers

# Create analyzer instance
analyzer = MarineAnalyzer()

'''
    
    # Convert cells
    for i, cell in enumerate(bluecloud_data.get('cells', [])):
        python_script += f"\n# Cell {i+1}\n"
        
        if cell['type'] == 'code':
            python_script += f"# Original JavaScript code (needs manual conversion):\n"
            js_lines = cell['content'].split('\n')
            for line in js_lines:
                python_script += f"# {line}\n"
            python_script += f"\n# TODO: Convert the above JavaScript to Python\n"
            python_script += f"pass  # Placeholder - replace with converted code\n\n"
            
        elif cell['type'] == 'markdown':
            python_script += f'"""\n{cell["content"]}\n"""\n\n'
    
    # Save Python script
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(python_script)
    
    print(f"✅ Converted to Python script: {output_file}")

def convert_js_to_python_comments(js_code):
    """Convert JavaScript code to Python with original code as comments"""
    lines = js_code.split('\n')
    python_code = "# Original JavaScript code (manual conversion needed):\n"
    
    for line in lines:
        python_code += f"# {line}\n"
    
    python_code += "\n# TODO: Convert the above JavaScript to Python\n"
    python_code += "# Example conversions:\n"
    python_code += "# console.log() -> print()\n"
    python_code += "# const/let/var -> (no declaration needed)\n"
    python_code += "# Math.min/max() -> min()/max() or np.min()/np.max()\n"
    python_code += "# Array methods -> list methods or numpy functions\n"
    python_code += "\npass  # Replace with converted Python code\n"
    
    return python_code

def convert_python_to_js_comments(python_code):
    """Convert Python code to JavaScript with original code as comments"""
    lines = python_code.split('\n')
    js_code = "// Original Python code (manual conversion needed):\n"
    
    for line in lines:
        js_code += f"// {line}\n"
    
    js_code += "\n// TODO: Convert the above Python to JavaScript\n"
    js_code += "// Example conversions:\n"
    js_code += "// print() -> console.log()\n"
    js_code += "// numpy functions -> Math functions or custom implementations\n"
    js_code += "// pandas operations -> custom data processing\n"
    js_code += "\n// Placeholder JavaScript code\nconsole.log('Conversion needed');\n"
    
    return js_code

def main():
    parser = argparse.ArgumentParser(
        description='Convert between Blue-Cloud and Jupyter notebook formats',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python convert_notebook.py -i notebook.json -o notebook.ipynb -f jupyter
  python convert_notebook.py -i notebook.ipynb -o notebook.json -f bluecloud
  python convert_notebook.py -i notebook.json -o script.py -f python
        """
    )
    
    parser.add_argument('-i', '--input', required=True,
                       help='Input file path')
    parser.add_argument('-o', '--output', required=True,
                       help='Output file path')
    parser.add_argument('-f', '--format', required=True,
                       choices=['jupyter', 'bluecloud', 'python'],
                       help='Output format')
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not Path(args.input).exists():
        print(f"❌ Error: Input file '{args.input}' not found")
        sys.exit(1)
    
    try:
        # Determine conversion based on format
        if args.format == 'jupyter':
            # Convert Blue-Cloud JSON to Jupyter
            with open(args.input, 'r', encoding='utf-8') as f:
                bluecloud_data = json.load(f)
            convert_bluecloud_to_jupyter(bluecloud_data, args.output)
            
        elif args.format == 'bluecloud':
            # Convert Jupyter to Blue-Cloud JSON
            convert_jupyter_to_bluecloud(args.input, args.output)
            
        elif args.format == 'python':
            # Convert Blue-Cloud JSON to Python script
            with open(args.input, 'r', encoding='utf-8') as f:
                bluecloud_data = json.load(f)
            convert_bluecloud_to_python(bluecloud_data, args.output)
    
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()