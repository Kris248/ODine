import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ContactlessRoundedIcon from "@mui/icons-material/ContactlessRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

const paymentIcons = {
  upi: QrCode2RoundedIcon,
  card: CreditCardRoundedIcon,
  wallet: AccountBalanceWalletRoundedIcon,
  netbanking: AccountBalanceRoundedIcon,
  cashless: ContactlessRoundedIcon
};

export function PaymentMethodCard({ method, selected, onSelect }) {
  const Icon = paymentIcons[method.id] || QrCode2RoundedIcon;

  return (
    <Card
      sx={{
        border: selected ? "1px solid rgba(155, 91, 61, 0.35)" : "1px solid transparent",
        boxShadow: selected ? 4 : 1
      }}
    >
      <CardActionArea onClick={() => onSelect(method.id)}>
        <CardContent sx={{ p: 2.25 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: selected ? "rgba(155, 91, 61, 0.12)" : "rgba(111, 128, 96, 0.1)",
                color: selected ? "primary.main" : "secondary.dark"
              }}
            >
              <Icon />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="h6">{method.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {method.helperText}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
