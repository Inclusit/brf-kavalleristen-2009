import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {handleApiErrors} from '@/app/lib/handleApiErrors';
import {createBadRequest,
  createUnauthorized,
  createForbidden,
} from '@/app/lib/errors';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const boardMembers = await prisma.boardMembers.findMany();
    return NextResponse.json(boardMembers);
  } catch (error: any) {
    console.warn('Error: Failed to get board members', error.message);
    return handleApiErrors(error);
  }
}

export async function POST(request: NextRequest) {

  try {
    const role = request.headers.get('role');
    if (role !== 'admin') {
     throw createUnauthorized('Unauthorized');
    }

    const body = await request.json();
    const {name, position, phone, email, image} = body;

    if (!name || !position || !phone || !email || !image) {
      throw createBadRequest('All fields are required');
    }

    const newBoardMember = await prisma.boardMembers.create({
      data: {
        name,
        position,
        phone,
        email,
        image,
      },
    });

    return NextResponse.json(newBoardMember);
  } catch (error: any) {
    console.warn('Error: Failed to create board member', error.message);
    return handleApiErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const role = request.headers.get('role');
    if (role !== 'admin') {
      throw createUnauthorized('Unauthorized');
    }
    
    const body = await request.json();
    const {id, name, position, phone, email, image} = body;

    if (!id || !name || !position || !phone || !email || !image) {
      throw createBadRequest('All fields are required');
    }

    const updatedBoardMember = await prisma.boardMembers.update({
      where: {id},
      data: {
        name,
        position,
        phone,
        email,
        image,
      },
    });

    return NextResponse.json(updatedBoardMember);
  } catch (error: any) {
    console.warn('Error: Failed to update board member', error.message);
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const {id} = await request.json();

    if (!id) throw createBadRequest('ID is required');

    const deletedBoardMember = await prisma.boardMembers.delete({
      where: {id},
    });

    return NextResponse.json(deletedBoardMember);
  } catch (error: any) {
    console.warn('Error: Failed to delete board member', error.message);
    return handleApiErrors(error);
  }
}