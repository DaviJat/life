import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

function Sidebar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div>
            <button type="button">Open Sheet</button>
          </div>
        </SheetTrigger>
        <SheetContent side="left">
          <p>Sheet Content</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
