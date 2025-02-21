"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";

const Navbar = () => {
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full bg-white py-3 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-700">AI Powered.</div>

      <div className="flex items-center gap-10">
        {["Home", "Features", "Contact", "About"].map((item) => {
          return (
            <p className="text-gray-600 hover:text-red-600 cursor-pointer" key={item}> 
              {item}
            </p>
          );
        })}
      </div>

      {/* Profile & Dropdown */}
      <Popover>
        <PopoverTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
            <AvatarFallback>HS</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <Button variant="ghost" className="w-full">
            Profile
          </Button>
          <Button variant="ghost" className="w-full">
            Settings
          </Button>
          <Button variant="ghost" className="w-full">
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default Navbar;
