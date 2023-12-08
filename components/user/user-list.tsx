import { MembersWithUsers } from "@/types/db-types";
import UserBox from "./user-box";

interface UserListProps {
  membersWithUsers: MembersWithUsers;
}

const UserList = ({ membersWithUsers }: UserListProps) => {
  return (
    <div>
      {membersWithUsers?.map((member) => (
        <UserBox key={member.id} data={member} />
      ))}
    </div>
  );
};

export default UserList;
