import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

export function StickyCartBar({ itemCount, total, currency, label, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        p: { xs: 1.5, sm: 2 },
        display: { xs: "block", md: "none" }
      }}
    >
      <Paper
        elevation={6}
        sx={{
          mx: "auto",
          maxWidth: 720,
          p: 1.25,
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(42,29,25,0.96), rgba(112,128,96,0.96))",
          color: "#fff9f2"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography fontWeight={700}>
              {itemCount} item{itemCount > 1 ? "s" : ""} • {formatCurrency(total, currency)}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,249,242,0.74)" }}>
              {label}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onAction}
            sx={{
              color: "primary.dark",
              bgcolor: "#fff8ef",
              "&:hover": {
                bgcolor: "#fff2de"
              }
            }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
