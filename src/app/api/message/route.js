import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {

  const roomId = request.nextUrl.searchParams.get("roomId");

  const foundRoomy = DB.rooms.find(x => x.roomId === roomId);


  readDB();

  if(!foundRoomy)
  {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const list = [];
  for(let i=0;i<DB.messages.length;i++){
    if(DB.messages[i].roomId === roomId)
    {
      list.push(DB.messages[i]);
    }
  }


  return NextResponse.json({
    ok:true,
    message:list
  })
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();

  const { roomId , messageText } = body;

  let checkagain = 0;
  for(let i=0;i<DB.rooms.length;i++)
  {
    if(DB.rooms[i].roomId === roomId) checkagain += 1;
  }

  if(checkagain == 0)
  {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  }


  const messageId = nanoid();

  writeDB();



  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
