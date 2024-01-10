import usePlacesAutocomplete from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { Input } from "../ui/input";

export const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } },
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
          className="bg-white border-gray-300  hover:cursor-pointer p-2"
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
    <div>
      <Input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Location"
      />

      {status === "OK" && (
        <ul className="m-2 border-2 border-gray-200">{renderSuggestions()}</ul>
      )}
    </div>
  );
};
