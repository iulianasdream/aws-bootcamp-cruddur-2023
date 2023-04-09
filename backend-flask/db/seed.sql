-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  --('Andrew Brown', 'andrew.brown@exampro.co', 'andrewbrown' ,'MOCK'),
  ('iuliana claudia', 'iulianaclaudia@exampro.co', 'iulianaclaudia' ,'MOCK'),
  ('silvasan iuliana', 'silvasaniuliana@exampro.co', 'silvasaniuliana' ,'MOCK'),
  ('Londo Mollari', 'lmollari@centari.com', 'londo' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    --(SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
    (SELECT uuid from public.users WHERE users.handle = 'iulianaclaudia' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )