import usePlacesAutocomplete from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

export const PlacesAutocomplete = ({
  onAddressSelect,
  selectState,
  setSelectState,
}: {
  onAddressSelect?: (address: string) => void;
  selectState: boolean;
  setSelectState: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" },
      types: ["(cities)"],
    },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          className="bg-white border-gray-300  hover:cursor-pointer hover:bg-gray-100 p-2"
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <>
      <div className="flex">
        <h1>{selectState}</h1>
        <Input
          value={value}
          disabled={!ready || selectState}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Location"
        />
      </div>

      {status === "OK" && (
        <ul className="m-2 border-2 rounded border-gray-200">
          {renderSuggestions()}
        </ul>
      )}
    </>
  );
};
