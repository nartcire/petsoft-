import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  onClick,
}: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon">
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  } else if (actionType === "edit") {
    return <Button variant="secondary">{children}</Button>;
  } else if (actionType === "checkout") {
    return (
      <Button onClick={onClick} variant="secondary">
        {children}
      </Button>
    );
  } else {
    throw new Error("Something went wrong within the PetButton Component");
  }
}
