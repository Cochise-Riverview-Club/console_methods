
def delete_reimport_transactions(payout_id)
  Shopify::PaymentTransaction.where(payout_id: payout_id).delete_all
  payout = Shopify::PaymentPayout.new payout_id: payout_id
  Shopify::PaymentTransaction.import_shopify payout
end
