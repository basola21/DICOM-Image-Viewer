from app import create_app
import os

app = create_app()

base_dir = os.path.abspath(os.path.dirname(__file__))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5100)
