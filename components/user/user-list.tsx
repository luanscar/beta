import { MembersWithUsers } from "@/types/db-types";
import UserBox from "./user-box";

interface UserListProps {
  membersWithUsers: MembersWithUsers;
}

const UserList = ({ membersWithUsers }: UserListProps) => {
  console.log(membersWithUsers);
  return (
    <div>
      {membersWithUsers?.map((member) => (
        <UserBox key={member.id} user={member.user} />
      ))}
    </div>
  );
};

export default UserList;
