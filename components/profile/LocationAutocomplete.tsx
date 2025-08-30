"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";
import { Loader2, MapPin } from "lucide-react";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

type LocationValue = {
  address: string;
  latitude?: number;
  longitude?: number;
};

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: LocationValue;
  onChange?: (value: LocationValue) => void;
}

export function LocationAutocomplete({
  label = "Address",
  placeholder = "Search your address",
  disabled,
  value,
  onChange,
}: LocationAutocompleteProps) {
  const googleKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "settings-places-autocomplete",
    googleMapsApiKey: googleKey,
    libraries: ["places"],
  });

  const searchBoxRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(value?.address ?? "");

  useEffect(() => {
    setInputValue(value?.address ?? "");
  }, [value?.address]);

  const onPlacesChanged = useCallback(async () => {
    try {
      const places = searchBoxRef.current?.getPlaces?.() ?? [];
      if (!places.length) return;
      const place = places[0];
      const addr = place.formatted_address || place.name || inputValue;
      const loc = place.geometry?.location;
      const lat = typeof loc?.lat === "function" ? loc.lat() : undefined;
      const lng = typeof loc?.lng === "function" ? loc.lng() : undefined;

      onChange?.({ address: addr, latitude: lat, longitude: lng });
      setInputValue(addr);
    } catch (e) {
      // Silent fallback
    }
  }, [inputValue, onChange]);

  if (!googleKey) {
    return (
      <div className="space-y-2">
        {label ? (
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {label}
          </Label>
        ) : null}
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.({ address: e.target.value });
          }}
          disabled={disabled}
          placeholder={placeholder}
        />
        <FormMessage />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label ? (
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> {label}
        </Label>
      ) : null}
      {!isLoaded ? (
        <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading Google Places…
        </div>
      ) : (
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
       >
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange?.({ address: e.target.value });
            }}
            disabled={disabled}
            placeholder={placeholder}
          />
        </StandaloneSearchBox>
      )}
      <FormMessage />
    </div>
  );
}

export default LocationAutocomplete;
