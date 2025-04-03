import { NextResponse } from "next/server";
import { Rembg } from "@xixiyahaha/rembg-node";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // ✅ File को Buffer में बदलो
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Sharp Object बनाओ
    const inputImage = sharp(buffer);

    // ✅ Background Remove करो
    const rembg = new Rembg();
    const outputImage = await rembg.remove(inputImage);

    // ✅ PNG में Convert करो
    const outputBuffer =  await outputImage.png().toBuffer();

    // const base64Image =  outputBuffer.toString("base64");

    // const imageUrl = `data:image/png;base64,${base64Image}`;
    // console.log("imageUrl", imageUrl)

    // ✅ File को `public` Folder में Save करो
    // const outputPath = path.join(process.cwd(), "public", "test-output.png");
    // fs.writeFileSync(outputPath, outputBuffer);


    console.log("✅ Background Removed & Saved Successfully!");

    return NextResponse.json({ imageUrl: outputBuffer });

  } catch (error) {
    console.error("❌ Error Removing Background:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
