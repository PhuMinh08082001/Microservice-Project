CREATE OR REPLACE FUNCTION update_total() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE public.ordertable SET total = total + NEW.price * NEW.quantity
        WHERE id = NEW.order_id;
    return new;
END;

$BODY$
language plpgsql;


CREATE TRIGGER trigger_upd_total_ordertable_after_insert_orderdetail
  BEFORE INSERT
  ON public.order_detail
  FOR EACH ROW
  EXECUTE PROCEDURE update_total();