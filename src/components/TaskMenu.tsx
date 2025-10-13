import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TaskMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  isCompleted: boolean;
}

const TaskMenu = ({ onEdit, onDelete, onToggleComplete, isCompleted }: TaskMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Icon name="MoreVertical" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onToggleComplete}>
          <Icon name={isCompleted ? "X" : "Check"} className="mr-2" size={16} />
          {isCompleted ? 'Вернуть в работу' : 'Отметить выполненной'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Icon name="Pencil" className="mr-2" size={16} />
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Icon name="Trash2" className="mr-2" size={16} />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskMenu;
