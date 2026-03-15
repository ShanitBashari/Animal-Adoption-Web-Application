import React, { useState, useEffect, useRef } from "react";
import { TextField, List, ListItem, Paper, CircularProgress, Box } from "@mui/material";

/**
 * Delays value updates until the user stops typing for the given delay.
 * Helps reduce the number of API requests while typing.
 */
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return v;
}

/**
 * Autocomplete input for location search using the Nominatim API.
 * Returns the selected display name, and optionally the full option object.
 */
export default function LocationNominatimAutocomplete({
  value,
  onChange,
  placeholder = "Type a place..."
}) {
  const [input, setInput] = useState(value || "");
  const debounced = useDebounce(input, 350);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);

  /**
   * Searches locations only after the debounced input changes.
   * Previous requests are canceled to avoid race conditions.
   */
  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    const q = encodeURIComponent(debounced);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1&limit=6&accept-language=en`;

    fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        // Normalize the response to a cleaner option structure for the UI.
        const mapped = (data || []).map((item) => ({
          id: item.place_id,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: item.type,
          raw: item
        }));

        setOptions(mapped);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Nominatim err", err);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [debounced]);

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        required
        label="Location"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onChange && onChange(e.target.value);
        }}
        placeholder={placeholder}
        fullWidth
      />

      {loading && (
        <CircularProgress size={20} sx={{ position: "absolute", right: 12, top: 14 }} />
      )}

      {options.length > 0 && (
        <Paper sx={{ position: "absolute", zIndex: 1000, left: 0, right: 0, mt: 1 }}>
          <List dense>
            {options.map((opt) => (
              <ListItem
                button
                key={opt.id}
                onClick={() => {
                  setInput(opt.display_name);
                  setOptions([]);
                  onChange && onChange(opt.display_name, opt);
                }}
              >
                {opt.display_name}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}