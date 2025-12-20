import zipfile
import os

def create_zip():
    zip_filename = 'bellavista_backend_v3_linux.zip'
    backend_dir = 'backend'
    
    # Exclusions
    exclusions = {'instance', '__pycache__', '.venv', 'venv', '.git', '.env'}
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 1. Add Procfile (create it in memory/temp or just write string if possible? No, file needs to exist)
        # We will create a temp Procfile
        with open('Procfile_linux', 'w') as f:
            f.write('web: gunicorn wsgi:app')
        
        zipf.write('Procfile_linux', 'Procfile')
        os.remove('Procfile_linux')
        
        # 2. Add backend files to ROOT of zip
        for root, dirs, files in os.walk(backend_dir):
            # Modify dirs in-place to skip exclusions
            dirs[:] = [d for d in dirs if d not in exclusions]
            
            for file in files:
                if file in exclusions or file.endswith('.pyc'):
                    continue
                if file == '.env':
                    continue
                    
                file_path = os.path.join(root, file)
                # Calculate relative path from backend/
                # e.g. backend/app/routes.py -> app/routes.py
                rel_path = os.path.relpath(file_path, backend_dir)
                
                # Force forward slashes
                arcname = rel_path.replace(os.sep, '/')
                
                print(f"Adding {arcname}")
                zipf.write(file_path, arcname)

        # Add .ebextensions
        if os.path.exists('.ebextensions'):
            for root, dirs, files in os.walk('.ebextensions'):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Normalize path for zip (forward slashes)
                    arcname = file_path.replace(os.sep, '/')
                    print(f"Adding {arcname}")
                    zipf.write(file_path, arcname)

    print(f"Created {zip_filename} successfully!")

if __name__ == '__main__':
    create_zip()
