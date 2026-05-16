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
        border: selected ? "1px solid rgba(226,55,68,0.55)" : "1px solid rgba(231,216,212,0.95)",
        boxShadow: selected ? "0 18px 40px rgba(226,55,68,0.10)" : undefined
      }}
    >
      <CardActionArea onClick={() => onSelect(method.id)} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack spacing={0.7} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight={800}>
                  {method.label}
                </Typography>
                {selected ? <CheckCircleRoundedIcon color="primary" fontSize="small" /> : null}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {method.helperText}
              </Typography>
            </Stack>

            <Stack alignItems="flex-end" spacing={0.75}>
              <Chip icon={getMethodIcon(method.type)} label={method.type} variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
