import { useState } from "react";
import { TextField, Button, FormControlLabel, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import authSlice, {
  authenticateUser,
  resetUser,
  changeMode,
} from "../redux/authSlice";

export default function Auth() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.userAuth.mode);
  const error = useSelector((state) => state.userAuth.error);
  const isLoading = useSelector((state) => state.userAuth.isLoading);

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      mode === "register" &&
      userInput.password !== userInput.confirmPassword
    ) {
      return;
    }

    dispatch(
      authenticateUser({
        email: userInput.email,
        password: userInput.password,
        mode,
      }),
    );
    setUserInput({ email: "", password: "", confirmPassword: "" });
  };
  const handleModeChange = () => {
    dispatch(changeMode());
  };
  return (
    <span className="flex items-center justify-center min-h-screen w-screen ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 p-8 max-w-md mx-auto bg-white shadow-xl rounded-xl"
      >
        <FormControlLabel
          control={
            <Switch checked={mode === "register"} onChange={handleModeChange} />
          }
          label={mode === "login" ? "Switch to Register" : "Switch to Login"}
          className="self-center"
        />
        <div className="space-y-4">
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            required
            fullWidth
            value={userInput.email}
            onChange={(e) => {
              setUserInput((prevUserInput) => ({
                ...prevUserInput,
                email: e.target.value,
              }));
            }}
            className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            required
            fullWidth
            value={userInput.password}
            onChange={(e) => {
              setUserInput((prevUserInput) => ({
                ...prevUserInput,
                password: e.target.value,
              }));
            }}
            className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {mode === "register" && (
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              required
              fullWidth
              value={userInput.confirmPassword}
              onChange={(e) => {
                setUserInput((prevUserInput) => ({
                  ...prevUserInput,
                  confirmPassword: e.target.value,
                }));
              }}
              className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4 py-3 text-lg hover:bg-blue-700"
          disabled={isLoading}
        >
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </span>
  );
}
