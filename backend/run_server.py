import os
import subprocess
import sys
import time

def kill_port(port):
    try:
        if sys.platform == "win32":
            output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True).decode()
            for line in output.splitlines():
                if "LISTENING" in line:
                    pid = line.strip().split()[-1]
                    print(f"Killing process {pid} on port {port}")
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True)
    except Exception:
        pass

def run():
    print("🚀 Starting PG Dhundo Professional Backend...")
    kill_port(8000)
    
    # Path to the virtual environment's python
    venv_py = os.path.join("venv", "Scripts", "python.exe") if sys.platform == "win32" else os.path.join("venv", "bin", "python")
    
    if not os.path.exists(venv_py):
        print("❌ Virtual environment not found. Please create it first.")
        return

    # Start main.py
    subprocess.run([venv_py, "main.py"])

if __name__ == "__main__":
    run()
