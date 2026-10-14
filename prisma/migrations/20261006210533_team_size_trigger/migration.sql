-- Garante no próprio banco o limite de 6 pokémons por treinador.
-- O caso de uso já valida isso, mas assim duas capturas simultâneas
-- não conseguem passar do limite (race condition).
CREATE OR REPLACE FUNCTION check_team_size() RETURNS trigger AS $$
BEGIN
  -- trava o treinador para serializar capturas concorrentes do mesmo treinador
  PERFORM 1 FROM "trainers" WHERE "id" = NEW."trainer_id" FOR UPDATE;

  IF (SELECT COUNT(*) FROM "captures" WHERE "trainer_id" = NEW."trainer_id") >= 6 THEN
    RAISE EXCEPTION 'TEAM_FULL: treinador % já possui 6 pokémons no time', NEW."trainer_id"
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "captures_team_size_limit"
  BEFORE INSERT ON "captures"
  FOR EACH ROW EXECUTE FUNCTION check_team_size();
