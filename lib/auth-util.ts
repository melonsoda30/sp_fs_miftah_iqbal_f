import { prisma } from "./prisma";

export async function checkIsOwner(
  projectId: string,
  userId: string
): Promise<boolean> {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    return !!project;
  } catch (error) {
    console.error("Error checking project ownership:", error);
    return false;
  }
}

export async function checkProjectAccess(
  projectId: string,
  userId: string
): Promise<boolean> {
  try {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    console.log("membership:", membership);

    return !!membership;
  } catch (error) {
    console.error("Error checking project access:", error);
    return false;
  }
}
