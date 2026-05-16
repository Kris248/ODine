import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

export function StickyCartBar({
  itemCount = 0,
  total = 0,
  currency = "INR",
  label = "Your cart is ready",
  actionLabel = "View cart",
  onAction
}) {
  const theme = useTheme();

  if (!itemCount) {
    return null;
  }

  return (
    <Box
      sx={{
        position: { xs: "fixed", md: "sticky" },
        left: { xs: 12, md: "auto" },
        right: { xs: 12, md: "auto" },
        bottom: { xs: 12, md: "auto" },
        top: { md: 16 },
        zIndex: 25,
        width: { xs: "calc(100vw - 24px)", md: "100%" },
        maxWidth: { md: 540 },
        ml: { md: "auto" }
      }}
    >
      <Paper
        elevation={6}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "rgba(226,55,68,0.10)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0
              }}
            >
              <ShoppingBagRoundedIcon color="primary" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {itemCount} item{itemCount === 1 ? "" : "s"} • {formatCurrency(total, currency)}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onAction}
            sx={{ whiteSpace: "nowrap" }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
