import bcrypt from "bcrypt";
import User from "@/models/User";
import connect from "@/lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sendEmail from "@/helpers/mail/mail.helper";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  const key = `${fileName}-${Date.now()}`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `profileImage/${key}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return key;
}

export async function GET(req) {
  await connect();

  try {
    const users = await User.find({});

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connect();
    const formData = await req.formData();
    const fields = {};
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }
    const {
      name,
      username,
      email,
      password,
      location,
      website,
      birthday,
      word,
      story,
      selectedImage,
    } = fields;

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      throw new Error("User already exists");
    }

    let imageName = "";

    if (selectedImage !== null && selectedImage && selectedImage !== "null") {
      const buffer = Buffer.from(await selectedImage.arrayBuffer());
      imageName = await uploadFileToS3(buffer, selectedImage.name);
    }


    console.log({
      name,
      username,
      email,
      password,
      location,
      website,
      birthday,
      word,
      story,
      profilImage: imageName,
    });

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      location,
      website,
      birthday,
      word,
      story,
      profilImage: imageName,
    });

    await newUser.save();

    const body = `
    <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
      <img src="https://www.booksment.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FnewLogo.41e5950b.png&w=640&q=75" style="display: block; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Welcome to Our Community</h1>
      <p style="color: #333; text-align: center;">Dear ${newUser.username},</p>
      <p style="color: #333; text-align: center;">We are thrilled to have you here! Get ready to share your stories and connect with other people.</p>
      <hr>
      <p style="color: #333; text-align: center;">If you have any questions, feel free to reach out to our support team.</p>
      <p style="color: #333; text-align: center;">Best,</p>
      <a href="https://www.booksment.com"><p style="color: #333; text-align: center; font-style: italic;">Booksment</p></a>
      <div style="text-align: center;">
        <a href="http://localhost:3000/verifyMailAddress/${newUser._id}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border: none; border-radius: 5px;">Verify Email</a>
      </div>
    </div>
    `;
    await sendEmail(newUser.email, "Welcome to our community", body);

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connect();
    const formData = await req.formData();
    const fields = {};
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }
    const {
      name,
      username,
      email,
      location,
      website,
      birthday,
      word,
      story,
      newProfilImage,
    } = fields;

    const isExisting = await User.findOne({ email });

    if (!isExisting) {
      throw new Error("User not exists");
    }
    let imageName = "";
    if (newProfilImage.name) {
      const buffer = Buffer.from(await newProfilImage.arrayBuffer());
      imageName = await uploadFileToS3(buffer, newProfilImage.name);
    } else {
      imageName = isExisting?.profilImage;
    }

    const newUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        username,
        location,
        website,
        birthday,
        word,
        story,
        profilImage: imageName,
      },
      { new: true }
    );
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
