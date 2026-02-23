DO $$
DECLARE
  v_module_id UUID;
  v_lesson_id UUID;
BEGIN
  -- 1. Find the 'Money Mindset' module ID
  SELECT id INTO v_module_id FROM public.modules WHERE title = 'Money Mindset' LIMIT 1;

  -- Ensure module exists
  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module "Money Mindset" not found. Please run the schema script first.';
  END IF;

  -- 2. Insert the Lesson
  INSERT INTO public.lessons (module_id, title, duration, order_index)
  VALUES (v_module_id, 'How Money Really Works', 5, 1)
  RETURNING id INTO v_lesson_id;

  -- 3. Insert the Cards
  INSERT INTO public.cards (lesson_id, type, content, metadata, order_index) VALUES
  -- Card 1 (hook)
  (v_lesson_id, 'hook', 'A large number of young earners struggle to save even 10% of their income. At the same time, many high income people still live paycheck to paycheck. So what really decides financial stability?', '{}', 1),

  -- Card 2 (concept)
  (v_lesson_id, 'concept', 'Wealth is not how much money you earn. Wealth is how much money you keep and grow.', '{"icon": "trending-up", "subtext": "Income shows earning power. Wealth shows financial strength."}', 2),

  -- Card 3 (explanation)
  (v_lesson_id, 'explanation', 'If all your income goes into rent, food, and EMIs, your future does not improve — only your lifestyle changes. Wealth grows only when part of your income is protected.', '{}', 3),

  -- Card 4 (example)
  (v_lesson_id, 'example', 'A earns ₹25k and saves ₹5k. B earns ₹60k and saves nothing. After one year, A has real progress. B only has spending history.', '{}', 4),

  -- Card 5 (interaction)
  (v_lesson_id, 'interaction', 'Who is actually becoming financially stronger?', '{"options": [{"id": "a", "text": "₹25k income, ₹5k saved"}, {"id": "b", "text": "₹60k income, ₹0 saved"}], "correct_id": "a"}', 5),

  -- Card 6 (advice)
  (v_lesson_id, 'advice', 'The moment you receive money, separate your saving amount immediately. Do not wait to see what is left at the end of the month.', '{}', 6),

  -- Card 7 (quiz)
  (v_lesson_id, 'quiz', 'Which habit builds wealth faster?', '{"question": "Which habit builds wealth faster?", "options": ["Spend first", "Save first"], "answer": "Save first"}', 7),

  -- Card 8 (reward)
  (v_lesson_id, 'reward', 'Lesson Completed!', '{"xp": 30, "streak_bonus": true}', 8);

END $$;
