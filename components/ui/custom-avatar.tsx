import { Avatar, AvatarFallback } from "./avatar";

const getColorFromString = (str: string) => {
  const colors = [
    "#F87171", // red-400
    "#FB923C", // orange-400
    "#FACC15", // yellow-400
    "#34D399", // emerald-400
    "#60A5FA", // blue-400
    "#A78BFA", // violet-400
    "#F472B6", // pink-400
    "#FCD34D", // amber-300
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

type Member = {
  id: string;
  email: string;
};

type CustomAvatarProps = {
  data: Member[];
  maxDisplay?: number;
};

export function CustomAvatar({ data, maxDisplay = 5 }: CustomAvatarProps) {
  const displayData = data.slice(0, maxDisplay);
  const remainingCount = data.length - maxDisplay;

  const getInitials = (member: Member): string => {
    if (member.email) {
      return member.email[0].toUpperCase();
    }

    return "?";
  };

  const getColorKey = (member: Member): string => {
    return member.email || member.id || "default";
  };

  return (
    <div className="flex -space-x-2">
      {displayData.map((member, index) => (
        <Avatar
          key={member.id ?? `member-${index}`}
          className="ring-2 ring-background border-2 border-white"
          title={member.email}
        >
          <AvatarFallback
            style={{
              backgroundColor: getColorFromString(getColorKey(member)),
              color: "white",
            }}
            className="font-semibold text-sm"
          >
            {getInitials(member)}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingCount > 0 && (
        <Avatar className="ring-2 ring-background border-2 border-white">
          <AvatarFallback
            style={{
              backgroundColor: "#6B7280",
              color: "white",
            }}
            className="font-semibold text-sm"
          >
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
