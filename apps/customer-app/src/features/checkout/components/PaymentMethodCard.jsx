import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

function getMethodIcon(type) {
  if (type === "bank") return <AccountBalanceRoundedIcon fontSize="small" />;
  if (type === "instant") return <PaymentsRoundedIcon fontSize="small" />;
  return <CreditCardRoundedIcon fontSize="small" />;
}

export function PaymentMethodCard({ method, selected, onSelect }) {
  return (
    <Card
      sx={{
        border: selected ? "1px solid rgba(15,118,110,0.38)" : "1px solid rgba(215,224,218,0.92)",
        boxShadow: selected ? "0 16px 32px rgba(15,118,110,0.10)" : undefined
      }}
    >
      <CardActionArea onClick={() => onSelect(method.id)} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {getMethodIcon(method.type)}
                <Typography variant="subtitle1" fontWeight={850}>
                  {method.label}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {method.helperText}
              </Typography>
            </Stack>
            {selected ? <Chip icon={<CheckCircleRoundedIcon sx={{ fontSize: 18 }} />} label="Selected" color="primary" size="small" /> : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
