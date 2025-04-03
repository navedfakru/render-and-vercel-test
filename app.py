from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from rembg import remove
from PIL import Image
import io
import base64
import traceback

app = FastAPI()

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/remove_background")
async def remove_background(image: UploadFile = File(...)):
    try:
        image_data = await image.read()
        input_image = Image.open(io.BytesIO(image_data))

        # इमेज का आकार बदलें (वैकल्पिक)
        max_size = 1024
        if max(input_image.size) > max_size:
            input_image.thumbnail((max_size, max_size))

        output_image = remove(input_image)
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return JSONResponse(content={"image": img_str})

    except Exception as e:
        error_message = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}\n{error_message}")

# FastAPI सर्वर रन करने के लिए
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
