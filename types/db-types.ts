import { Company, Member, User } from "@prisma/client";

export type CompanyWithMembersWithUsers = Company & {
  members: (Member & { user: User })[];
};



export type MembersWithUsers = (Member & { user: User })


// export type NextApiResponseServerIo = NextApiResponse & {
//   socket: Socket & {
//     server: NetServer & {
//       io: SocketIOServer;
//     };
//   };
// };