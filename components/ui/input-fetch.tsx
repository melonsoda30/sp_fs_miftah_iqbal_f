"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from "next/navigation";
import { UserSummary } from "@/types/db";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface SelectOptions {
  value: string;
  label: string;
}

const InputFetch = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<SelectOptions[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);

  const { id } = useParams();
  const { mutate } = useSWR(`/api/projects/${id}/membership`, fetcher);

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch data dari API
  const fetchOptions = useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/projects/${id}/search-user?query=${query}`
        );

        const data = await response.json();

        console.log(data);
        const mappingData = data.map((user: UserSummary) => ({
          value: user.id.toString(),
          label: user.email,
        }));
        setOptions(mappingData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  const storeOption = async (selected: SelectOptions) => {
    try {
      console.log(selected);
      const response = await fetch(`/api/projects/${id}/membership`, {
        method: "POST",
        body: JSON.stringify({
          userId: selected.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (!json.success) {
        throw new Error("Failed to patch data");
      }
      await mutate();
      setOptions([]);
      setValue("");
      setSearchQuery("");
      console.log(response);
    } catch (error) {
      console.error("Error patching data:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchOptions(debouncedSearchQuery);
    } else {
      setOptions([]);
    }
  }, [debouncedSearchQuery, fetchOptions]);

  const handleSelect = (currentValue: string) => {
    const selected = options.find((option) => option.value === currentValue);
    setValue(currentValue === value ? "" : currentValue);
    // setSelectedItem(selected || null);
    if (selected) {
      storeOption(selected);
    }
    setOpen(false);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  return (
    <div className=" ml-auto space-y-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <Plus /> Add Members
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              {/* <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" /> */}
              <CommandInput
                placeholder="Search users..."
                value={searchQuery}
                onValueChange={handleSearchChange}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              {isLoading && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
              )}
            </div>

            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {/* <span className="text-sm text-muted-foreground">
                    Searching...
                  </span> */}
                </div>
              ) : (
                <>
                  {searchQuery && searchQuery.length < 2 && (
                    <CommandEmpty>
                      Type at least 2 characters to search
                    </CommandEmpty>
                  )}

                  {searchQuery &&
                    searchQuery.length >= 2 &&
                    options.length === 0 &&
                    !isLoading && <CommandEmpty>No users found</CommandEmpty>}

                  {options.length > 0 && (
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={handleSelect}
                          className="cursor-pointer"
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-row">
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InputFetch;
