from flask import Flask, request, jsonify, render_template
from rembg import remove
from PIL import Image
import io
import base64
import traceback

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/remove_background', methods=['POST'])
def remove_background():
    try:
        image_data = request.files['image'].read()
        input_image = Image.open(io.BytesIO(image_data))

        # इमेज का आकार बदलें (वैकल्पिक)
        max_size = 1024  # अधिकतम आकार
        if max(input_image.size) > max_size:
            input_image.thumbnail((max_size, max_size))

        output_image = remove(input_image)
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return jsonify({'image': img_str})

    except Exception as e:
        error_message = traceback.format_exc() #अधिक विस्तृत त्रुटि संदेश
        return jsonify({'error': f"An error occurred: {str(e)}\n{error_message}"}), 500

if __name__ == '__main__':
    app.run(debug=True)