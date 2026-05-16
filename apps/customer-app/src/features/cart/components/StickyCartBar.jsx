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

  if (!itemCount) return null;

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
        maxWidth: { md: 560 },
        ml: { md: "auto" }
      }}
    >
      <Paper
        elevation={6}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: "rgba(15,118,110,0.08)",
              flexShrink: 0
            }}
          >
            <ShoppingBagRoundedIcon color="primary" fontSize="small" />
          </Stack>

          <Stack spacing={0.15} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={850} noWrap>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {itemCount} item{itemCount === 1 ? "" : "s"} · {formatCurrency(total, currency)}
            </Typography>
          </Stack>

          <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={onAction}>
            {actionLabel}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
