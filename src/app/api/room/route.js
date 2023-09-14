import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  

  const body = await request.json();
  const { roomName } = body;

  let check = 0;
  readDB();
  for(let i=0;i<DB.rooms.length;i++)
  {
    if(roomName === DB.rooms[i].roomName) check += 1;
  }

  if(check > 0)
  {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );

  }

  const roomId = nanoid();

  //call writeDB after modifying Database
  writeDB();

  DB.rooms.push(
    {
      roomId:roomId,
      roomName:roomName
    }
  );

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
