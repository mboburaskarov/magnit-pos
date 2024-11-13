import { useState } from "react";
import {
  Box,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
} from "@mui/material";

const CheckBox = ({
  name,
  required,
  setValue,
  label,
  fullWidth,
  uncontrolled,
}) => {
  // const [open, setOpen] = useState(false);
  // const [openDrawer, setOpenDrawer] = useState(false);
  // const { ref, setUnmaskedValue, value } = useIMask({
  //   lazy: true,
  //   placeholderChar: "x",
  // });
  return (
    <>
      <Box position="relative">
        {/* {label && (
          <Label mb={1.5} required={required}>
            {label}
          </Label>
        )}{" "} */}
        <FormControlLabel
          sx={{ display: "flex", alignItems: "center" }}
          control={
            <Checkbox
              checked={true}
              onChange={(handleChange) => {}}
              name="gilad"
            />
          }
          label="Remember Me"
        />
        {/* <TextField
          fullWidth={fullWidth}
          required={required}
          // inputRef={ref}
          value={value}
          type="email"
          setValue={(e) => {
            setValue(e);
          }}
          uncontrolled={uncontrolled}
        /> */}
      </Box>
    </>
  );
};
export default CheckBox;
