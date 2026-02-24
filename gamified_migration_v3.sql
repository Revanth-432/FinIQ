-- ========================================================
-- FINANCIAL LITERACY APP - GAMIFIED REALITY ENGINE MIGRATION V2
-- FORMAT: Array Options Schema + Explanations
-- ========================================================

DO $$
DECLARE
  v_lesson_id BIGINT;
BEGIN

  -- 1. NUKE OLD STATIC TEXT CARDS
  DELETE FROM public.cards;

  -- ========================================
  -- MODULE 1: HOW MONEY REALLY WORKS
  -- ========================================

  -- LESSON: Why High Income ≠ Wealth
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Why High Income ≠ Wealth%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Meet Rahul. ₹12 LPA tech job, but orders Swiggy 3x a day and took an iPhone EMI."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Income is earning power. Wealth is what you keep. Who is actually becoming financially stronger?"', ARRAY['A) ₹25k income and ₹5k saved', 'B) ₹60k income and ₹0 saved'], 0, 20, '🪙 Fin: "Correct! Earning ₹60k means nothing if it all goes straight to restaurants and rent."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "If all your income goes into rent, subscriptions, shopping and EMIs, your future does not improve — only your lifestyle changes."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Help Rahul figure out where his money goes. Swipe RIGHT for Needs, LEFT for Wants."', ARRAY['Rent:right', 'Goa Trip:left', 'Jordans:left', 'Groceries:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: The moment you receive money, separate your saving amount immediately. It must be a decision, not an accident."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Which habit builds wealth faster?"', ARRAY['Spend first, save whatever is left over', 'Save first, live on the rest'], 1, 50, '🪙 Fin: "Boom! Pay yourself first. Otherwise capitalism will gladly take every last rupee you earn."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 1: HOW MONEY REALLY WORKS
  -- ========================================

  -- LESSON: Save vs Invest (Properly)
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Save vs Invest (Properly)%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Priya keeps ₹5 Lakhs in her ICICI Savings account because ''''it feels safe''''. Bless her heart."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "What is her bank actually doing with that money?"', ARRAY['Keeping it safe in a vault', 'Lending it out at 12% and paying her 3%'], 1, 20, '🪙 Fin: "Banks are businesses. They literally lend your idle cash out to others at massive interest rates while paying you peanuts."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Saving protects your short-term life. Investing grows your long-term future. Mixing their purpose is a massive beginner mistake."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "If banks pay 3%, what is the realistic minimum return you should expect from good investments? Slide to guess!"', ARRAY['1', '15', '10'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: First build an emergency fund. Then start investing small but regularly."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What should come first for a beginner?"', ARRAY['Start day trading with full salary', 'Build a liquid emergency fund'], 1, 50, '🪙 Fin: "Yes! If you skip the emergency fund, you''''ll be forced to sell your investments at a loss the moment your phone breaks."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 1: HOW MONEY REALLY WORKS
  -- ========================================

  -- LESSON: Inflation is Silent Killer
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Inflation is Silent Killer%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Remember when a plate of momos cost ₹30? Now it''''s ₹80. Your money is physically shrinking."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "If your savings grow at 4% per year and inflation is 6%, are you actually gaining money?"', ARRAY['Yes, the number is going up!', 'No, I am losing buying power.'], 1, 20, '🪙 Fin: "Nailed it. Your bank balance grew, but the cost of surviving grew faster. You are technically poorer."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Any return below inflation is a real loss. It eats 6% of your buying power every single year in India."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for things that BEAT inflation, LEFT for things killed by it."', ARRAY['Cash under mattress:left', 'Mutual Funds:right', 'Savings Account:left', 'Real Estate:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Your investments MUST generate more than 7% return, or you are literally getting poorer everyday."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What is the true cost of inflation?"', ARRAY['Prices go up, money buys less', 'It makes salaries look bigger'], 0, 50, '🪙 Fin: "Exactly. Inflation is the invisible tax on people who just hoard cash."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 1: HOW MONEY REALLY WORKS
  -- ========================================

  -- LESSON: Start Early = Win Big
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Start Early = Win Big%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "One friend starts investing at 18. The other starts at 28. The early starter ends up with almost double. The difference isn''''t money — it''''s time."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Which gives compounding more power?"', ARRAY['A huge monthly amount', 'More years safely invested'], 1, 20, '🪙 Fin: "Time is the magic ingredient. A student investing ₹500/mo usually beats a 30-year old investing ₹5,000/mo."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Compounding means your money earns returns, and those returns start earning returns too. A snowball of cash."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "If you get a steady 12% return, how many years does it actually take to precisely double your money? Slide!"', ARRAY['1', '15', '6'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Start small, but start now. Consistency beats waiting for a ''''perfect'''' massive salary."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What matters more for beginner investors?"', ARRAY['Waiting to find the perfect stock', 'Just starting to build the habit of time'], 1, 50, '🪙 Fin: "Perfection is the enemy of progress. The most important metric right now is simply starting the clock."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 2: MASTER YOUR SPENDING & SAVINGS
  -- ========================================

  -- LESSON: Where Your Money Actually Goes
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Where Your Money Actually Goes%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Your problem is usually not income — it’s visibility. Small daily spending silently destroys big monthly savings."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Which expense usually grows wildly without you even noticing?"', ARRAY['Rent and electricity bills', 'Small daily cafes and online orders'], 1, 20, '🪙 Fin: "Yep. Spending ₹150 every day doesn''''t hurt your brain, but ₹4500 gone at the end of the month crushes your wallet."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Food orders, rides, quick shopping, coffees. Each one feels small and harmless. Together, they quietly become your biggest drain."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT on things you should Track, LEFT on fixed costs."', ARRAY['Rent:left', '3AM Swiggy Orders:right', 'Electricity Bill:left', 'Random Amazon impulse buys:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Track every expense for just 7 days. No judging. No cutting. Only observing your actual pattern."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What is the main benefit of tracking your money?"', ARRAY['To feel guilty about living life', 'To gain total control over your blind spots'], 1, 50, '🪙 Fin: "Knowledge is power. Simply knowing where the leak is located is 90% of the battle won."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 2: MASTER YOUR SPENDING & SAVINGS
  -- ========================================

  -- LESSON: Budgeting Without Feeling Broke
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Budgeting Without Feeling Broke%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Most people quit budgeting in a week. They think it''''s about cutting fun and eating dry rice. It''''s not."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Which feels easier to stick to?"', ARRAY['Absolutely 0 fun spending allowed', 'Limited but strictly planned fun spending'], 1, 20, '🪙 Fin: "Exactly. If you try to ban all fun, you''''ll crack by day 5 and splurge heavily. Planning the fun removes the guilt."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "When you don’t plan your spending, you feel guilty after every purchase. A budget removes that stress."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "What percentage of your income should ideally go to Wants and Fun? (Hint: The 50/30/20 rule)"', ARRAY['5', '50', '30'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Create only three buckets: Needs (50%), Wants (30%), Savings (20%). Complex budgets fail faster."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "A healthy beginner budget should definitely include:"', ARRAY['Punishment clauses for overspending', 'Guilt-free fun money allocated properly'], 1, 50, '🪙 Fin: "You have to live your life. Budgeting just makes sure your life doesn''''t bankrupt your future."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 2: MASTER YOUR SPENDING & SAVINGS
  -- ========================================

  -- LESSON: Emergency Fund (Before Investing)
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Emergency Fund (Before Investing)%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Most young investors stop investing after their first emergency. The market didn''''t fail them — life happened."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "You need ₹15k for a sudden medical bill. You have zero cash, only mutual funds."', ARRAY['Sell the mutual funds immediately.', 'Have an emergency fund first!'], 1, 20, '🪙 Fin: "Yes! If the market is down 10% that week, you just locked in a massive loss. Cash in the bank prevents this."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "An emergency fund protects your life from becoming a financial crisis. Investments are not meant to play this role."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Is this a valid use of an Emergency Fund? Swipe RIGHT for Yes, LEFT for No."', ARRAY['Job Loss:right', 'Buying an iPad on sale:left', 'Sudden medical surgery:right', 'Going to a concert:left'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Start with a small target. Even one month of basic expenses saved in a liquid account is enough to begin."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Emergency funds should ideally be kept in:"', ARRAY['Highly risky volatile stocks', 'Safe, liquid bank deposits or FDs'], 1, 50, '🪙 Fin: "Safety over Returns. An emergency fund is an insurance policy against disaster, not a wealth creator."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 2: MASTER YOUR SPENDING & SAVINGS
  -- ========================================

  -- LESSON: Lifestyle Inflation / First Salary Trap
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Lifestyle Inflation / First Salary Trap%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "You got a raise! Now you rent a better flat, buy nicer clothes, and end up with the exact same zero savings as before."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "After a salary increase, what is the mathematically correct thing to grow first?"', ARRAY['My lifestyle and sneaker collection', 'My savings and investing percentage'], 1, 20, '🪙 Fin: "Yes. The ''''First Salary Trap'''' destroys wealth because people upgrade their comfort instantly, forgetting their future."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Lifestyle inflation means your spending rises every time your income rises. Your financial position never actually moves forward."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "If you get a ₹10,000 raise, what percentage of that new money should definitely be bumped into investments?"', ARRAY['0', '100', '50'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Every time your income increases, increase your saving first — automatically. Upgrade your lifestyle only with what remains."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Lifestyle inflation mainly affects:"', ARRAY['Your boss''s mood', 'Your ability to ever build real wealth'], 1, 50, '🪙 Fin: "Bingo. If your expenses always match your income, you will be financially stuck on a treadmill until you die."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 3: INVEST SMART. AVOID MISTAKES.
  -- ========================================

  -- LESSON: Credit Cards & EMIs
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Credit Cards & EMIs%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Ah, the iPhone on EMI. The classic youth trap. You feel like a king, until the bank starts calling."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "A credit card charges you 3.5% interest. Is that per year or per month?"', ARRAY['A sweet 3.5% per year', 'Per MONTH. Meaning 42% a year!'], 1, 20, '🪙 Fin: "42% per year. Read that again. It''''s legal robbery if you fall into their late-payment trap."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Credit cards and EMIs let you use future money today. But that flexibility comes with heavy interest and hidden fees. You are buying time."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for Smart credit use, LEFT for Debt Traps."', ARRAY['Paying the full bill on time:right', 'Only paying the Minimum Due:left', 'Converting shoes to 12mo EMI:left', 'Using carefully for reward points:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Credit cards are knives. Good for chopping veggies (rewards), deadly if you grab the blade (unpaid balances)."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What happens when you only pay the ''Minimum Due''?"', ARRAY['You build an insanely high interest debt trap', 'Your credit score shoots up magically'], 0, 50, '🪙 Fin: "Correct. The minimum due only covers the interest. The actual debt sits there quietly multiplying like a virus."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 3: INVEST SMART. AVOID MISTAKES.
  -- ========================================

  -- LESSON: Risk vs Return
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Risk vs Return%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Your dad tells you FDs are the only safe way. Your gym bro tells you Crypto is the only fast way. The truth?"', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "If an investment promises a guaranteed 24% return per year, what is the actual risk level?"', ARRAY['Low risk, huge reward!', 'Extremely high risk of losing everything.'], 1, 20, '🪙 Fin: "Spot on. Risk and Return are twins. You cannot get high returns without taking high risk. It defies financial physics."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Some investments move slow and steady. Some move fast and wild. The faster the growth, the larger the falls."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "Where do large-cap Indian stocks (Nifty 50) usually sit on a risk scale of 1 to 10?"', ARRAY['1', '10', '6'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Never take more risk than your heart can handle, and never take less risk than inflation demands."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Higher potential return usually means:"', ARRAY['Guaranteed profit very quickly', 'Much higher volatility and uncertainty'], 1, 50, '🪙 Fin: "Yes! There is no free lunch in finance. To double your money, you must accept the risk of halving it."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 3: INVEST SMART. AVOID MISTAKES.
  -- ========================================

  -- LESSON: Stocks & Mutual Funds
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Stocks & Mutual Funds%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Millions invest every month without picking a single stock. Do you really need to be a Wall Street expert?"', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "You have ₹5,000. Do you buy 1 share of an expensive hot company, or a Mutual Fund?"', ARRAY['1 share! I am an elite trader.', 'Mutual Fund! I want a slice of 50 companies.'], 1, 20, '🪙 Fin: "Exactly. Mutual funds take your small cash, combine it with others, and hire a pro to buy the whole market for you."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Stocks give you full control but zero safety. Mutual funds reduce the effort and spread the risk across dozens of companies."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for Mutual Fund traits, LEFT for Individual Stock traits."', ARRAY['Requires 10 hours of research a week:left', 'Auto-diversified instantly:right', 'High concentration risk:left', 'Run by a professional manager:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: If you are new, start with mutual funds. Learn how markets behave first before jumping into direct stocks."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What makes Mutual Funds ideal for beginners?"', ARRAY['Instant diversification and low effort tracking', 'They guarantee 30% returns every year'], 0, 50, '🪙 Fin: "Nailed it. Diversification protects you from picking one bad company that goes bankrupt."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 3: INVEST SMART. AVOID MISTAKES.
  -- ========================================

  -- LESSON: How to Spot Financial Scams
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%How to Spot Financial Scams%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "''Bhai, just download this Telegram app, double your money in 25 days!''. Peak scam energy."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "A random WhatsApp group adds you and guarantees a daily 5% return on crypto. What do you do?"', ARRAY['Send them ₹10,000 to test it', 'Block, Report, Laugh'], 1, 20, '🪙 Fin: "Good. If someone knew how to double money in 25 days, they wouldn''''t share the secret with strangers on Telegram."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Scams attack your emotion, not your logic. Urgency, fear, and ''limited time offers'' are their weapons."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for Legit, LEFT for Scam flags."', ARRAY['Guaranteed zero-risk 40% returns:left', 'SEBI Registered Advisor ID:right', 'Asking for crypto transfer to unlock funds:left', 'Transparent risk documents:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: There are absolutely no guaranteed high returns. If it sounds too good to be true, it is a lie to steal from you."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What is the biggest red flag of an investment scam?"', ARRAY['Demanding you sign legal documents', 'Guaranteeing risk-free abnormally high returns'], 1, 50, '🪙 Fin: "Correct. The word ''Guaranteed'' next to anything above 8% is almost always a mathematical lie."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 4: INVESTING FOUNDATIONS
  -- ========================================

  -- LESSON: Investing vs Trading vs Speculation
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Investing vs Trading vs Speculation%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Watching a Finfluencer in a rented Lambo makes you wanna start F&O trading tomorrow. Huge mistake."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "You buy a stock hoping Elon Musk posts a tweet about it by Friday. Are you investing?"', ARRAY['Yes, I own the stock!', 'No, that is literal gambling (speculation).'], 1, 20, '🪙 Fin: "Correct. Investing studies value. Trading studies price. Speculation purely studies excitement and vibes."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Investing means buying a business for years. Speculation relies heavily on uncertainty and guessing the daily hype."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for Investing habits, LEFT for Speculation/Trading."', ARRAY['Holding index funds for a decade:right', 'Buying options on expiry day:left', 'Buying dog-themed coins on a rumor:left', 'Analyzing corporate balance sheets:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: 90% of retail day-traders lose money. Start as an investor. Understand patience before chasing speed."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Long-term investing fundamentally focuses on:"', ARRAY['Beating the market every single day', 'Steady business growth and patience'], 1, 50, '🪙 Fin: "Yes. Time is your greatest asset in the market. Speed is usually the enemy."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 4: INVESTING FOUNDATIONS
  -- ========================================

  -- LESSON: Time Horizon & Risk Capacity
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Time Horizon & Risk Capacity%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Two investors buy the same mutual fund. One panics and sells at a loss after 3 months. The other wins big after 5 years."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "You need to pay your MBA fee in 12 months. Where do you park the ₹3 Lakhs?"', ARRAY['A high-risk small-cap equity fund', 'A boring, safe Liquid Fund or FD'], 1, 20, '🪙 Fin: "Exactly. If you desperately need the money soon, your risk capacity is mathematically ZERO. Do not gamble it."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Short-term goals require sheer stability. Long-term goals can endure extreme volatility. Confusing the two causes financial stress."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "If an investment requires high volatility, what is the absolute minimum number of years you should confidently commit to holding it? Slide!"', ARRAY['1', '10', '5'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Money needed in <3 years goes to Debt/FDs. Money safely tucked away for 5+ years goes to Equity."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Mismatching your time horizon wildly increases your:"', ARRAY['Likelihood of locking in stress and losses', 'Guaranteed returns'], 0, 50, '🪙 Fin: "Spot on. Selling a 10-year asset on year 1 because you needed rent money is a planning failure, not a market failure."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- =========  ===============================
  -- MODULE 4: INVESTING FOUNDATIONS
  -- ========================================

  -- LESSON: Asset Classes Explained Clearly
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Asset Classes Explained Clearly%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Think of your portfolio like a cricket team. You need aggressive batsmen (Equity) and reliable bowlers (Debt)."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "If the stock market crashes entirely, what asset usually remains stable or goes up to protect you?"', ARRAY['More high-risk stocks', 'Gold & Debt (Bonds)'], 1, 20, '🪙 Fin: "Bullseye. Equity offers high growth but immense risk. Debt offers stability and acts as your anchor."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Equity = ownership in companies. Debt = lending money securely. Gold = store of value. You need a mix."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Match the Asset! Swipe RIGHT for Equity (Growth), LEFT for Debt (Stability)."', ARRAY['Government Bonds:left', 'Nifty 50 Shares:right', 'Fixed Deposits:left', 'Startup Angel Investing:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: A healthy portfolio mixes different asset classes so if one entirely crashes, the others keep you financially alive."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Putting all your money into exactly one asset class drastically increases your:"', ARRAY['Concentration Risk', 'Safety and Returns'], 0, 50, '🪙 Fin: "Correct. Never bet your entire financial existence on one singular outcome."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 4: INVESTING FOUNDATIONS
  -- ========================================

  -- LESSON: Goal-Based Investing Framework
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Goal-Based Investing Framework%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Investing without a target goal is like getting into a cab and saying ''just drive''. You are going to waste gas."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "What should be carefully defined FIRST before you pick a mutual fund?"', ARRAY['Which stock went up 40% last week', 'What my actual Goal and Timeline is'], 1, 20, '🪙 Fin: "Yes! First define purpose (House, Car, Retirement). Then select the investment instrument that matches the timeline."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Short goal (1 year) → low risk. Medium goal (3-5) → moderate risk. Long goal (10+) → aggressive growth assets."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Match the Goal to Risk! Swipe RIGHT for High Risk (Stocks), LEFT for Safe (FD/Debt)."', ARRAY['Retirement in 25 years:right', 'Macbook upgrade in 3 months:left', 'Child''s education in 15 years:right', 'Emergency 3-month fund:left'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Never choose an investment before defining its purpose. The purpose dictates the strategy."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Proper goal-based investing frameworks vastly reduce:"', ARRAY['Emotional and random investing decisions', 'Your need to diversify'], 0, 50, '🪙 Fin: "Well done. When you know EXACTLY what the money is for, market crashes don''''t scare you as much."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 5: SIP & MUTUAL FUNDS
  -- ========================================

  -- LESSON: What is SIP & How It Works
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%What is SIP & How It Works%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "You don''t need crores to get rich. You just need ₹5,000, automation, and 15 years to ignore the noise."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "The market just crashed 15% today. Your automated monthly SIP is scheduled for tomorrow. What do you do?"', ARRAY['Pause it out of sheer terror!', 'Let it execute. I''m buying on a steep discount.'], 1, 20, '🪙 Fin: "Exactly. Automating buys during a crash secures you more units for cheaper. It''''s called Rupee Cost Averaging."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "SIP stands for Systematic Investment Plan. Instead of waiting for perfect timing, you effortlessly build wealth through heavy discipline."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for disciplined SIP mentalities, LEFT for Trading panics."', ARRAY['Checking portfolio every 10 mins:left', 'Automating payments directly on the 5th:right', 'Panic selling on news headlines:left', 'Holding peacefully through market dips:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Automate your SIP. Treat it like a strict EMI you owe to your future self."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What uniquely happens during an SIP when markets fall significantly?"', ARRAY['You buy fewer units at terrible high prices', 'You automatically accumulate more units at cheaper prices'], 1, 50, '🪙 Fin: "Spot on. Crashing markets are the absolute best friends of long-term SIP investors."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 5: SIP & MUTUAL FUNDS
  -- ========================================

  -- LESSON: Types of Mutual Funds
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Types of Mutual Funds%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Saying ''I invest in mutual funds'' is vague. Are you eating dal rice (Index Funds) or spicy risky junk food (Sectoral Funds)?"', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "You want a completely passive fund that just copies the top 50 companies in India with super low fees. What do you buy?"', ARRAY['An active mid-cap aggressively managed fund', 'A Nifty 50 Index Fund!'], 1, 20, '🪙 Fin: "Boom. Index funds are the undisputed kings for lazy investors. Low fees, massive long term safety."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Equity funds = volatile growth. Debt funds = stable slow returns. Index funds = low-cost automatic market tracking."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "If an active fund charges 2% expense ratio a year, what is a typical cheap Index Fund fee? Slide!"', ARRAY['1.0', '5.0', '0.2'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Match the fund type firmly to your goal. Don''t buy a mega high-risk small-cap fund just because it flashed 40% yesterday."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What is the primary superpower of an Index Fund?"', ARRAY['Extremely low commission fees and passive broad market tracking', 'Guaranteed higher returns than risky crypto'], 0, 50, '🪙 Fin: "Yes! High active fund manager fees will secretly eat 30% of your wealth over 20 years. Index funds avoid this."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 5: SIP & MUTUAL FUNDS
  -- ========================================

  -- LESSON: Power of Staying Invested
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Power of Staying Invested%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "March 2020: The pandemic hits. The market crashes 30%. Millions panic sold their mutual funds and permanently locked in their losses."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "What did the incredibly smart investors do during that scary 30% massive crash?"', ARRAY['They bought MORE equities at a heavy 30% discount', 'They sold everything to hoard worthless cash'], 0, 20, '🪙 Fin: "Correct. By 2021, the market generated a massive V-shape recovery. The panic sellers cried. The bold holders rebuilt their lives."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Markets are highly cyclical. Short-term fear and emotional selling almost ALWAYS damages long-term mathematical growth."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for actions that build wealth, LEFT for destructive panics."', ARRAY['Selling entire portfolio on bad news:left', 'Remaining aggressively invested:right', 'Pausing SIPs for 3 years:left', 'Averaging down on high conviction funds:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Volatility is the invisible psychological fee you pay for market growth. If you can''t endure the drops, you don''t earn the gains."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Panic selling during a sudden market crash primarily mathematically results in:"', ARRAY['Locking in permanent unrecoverable losses', 'Protecting your long-term capital safely'], 0, 50, '🪙 Fin: "Nailed it. Reacting emotionally converts a temporary paper loss into a permanent real-world disaster."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 5: SIP & MUTUAL FUNDS
  -- ========================================

  -- LESSON: Common SIP Mistakes
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Common SIP Mistakes%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "90% of people start an SIP in January, get bored by June, and stubbornly stop it. Absolute tragic behavior."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Your friend says: ''My SIP gave -2% this year, mutual funds are totally a scam''. You reply:"', ARRAY['Yeah bro, let''s pivot to risky alt-coins', 'It''s a 10-year compounding game, stop crying over 1 year.'], 1, 20, '🪙 Fin: "Exactly. Checking a 10-year investment daily is like furiously pulling up a plant every morning to see if roots are growing."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "SIP is a long-term compound strategy. Treating it like an aggressive short-term trade creates immense frustration."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'slider_game', '🪙 Fin: "Slide to guess: How many years does heavy compounding actually start creating visibly massive magic in a portfolio?"', ARRAY['1', '15', '7'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Align expectations logically with reality. Invest for long-term profound growth, not monthly dopamine hits."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "What is the absolutely most common reason widespread SIPs fail to build wealth?"', ARRAY['The impatient investor gets bored and stops it within 2 years', 'The entire stock market runs out of available money'], 0, 50, '🪙 Fin: "Yes. The math works perfectly. The human psychology fails constantly."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 6: UNDERSTANDING STOCKS
  -- ========================================

  -- LESSON: Long-Term Investing vs Short-Term Trading
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Long-Term Investing vs Short-Term Trading%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Everyone thinks the stock market is a chaotic casino. It’s actually a weighing machine... if you wait long enough."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "A company''s profit doubles over 5 years. But the stock price drops 5% this week due to election panic. What matters more?"', ARRAY['The election news! Liquidate immediately!', 'The massive compounding profit doubling over 5 years.'], 1, 20, '🪙 Fin: "Spot on. Short term is wildly driven by emotions and headlines. Long term is driven strictly by relentless business profit."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Trading requires constant exhaustion and monitoring. Investing requires patient analysis and sitting on your hands."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for Long-Term Investor logic, LEFT for Short-Term panic."', ARRAY['Selling because Twitter is panicking:left', 'Holding because quarterly revenue skyrocketed 15%:right', 'Buying directly off a random hot WhatsApp tip:left', 'Deeply researching corporate debt levels:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: If you lack time and vast experience, avoid short-term trading. It is a zero sum game built to drain you."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "In the deeply long term, fundamental stock prices primarily track and follow:"', ARRAY['News anchors shouting dramatically on TV', 'The actual sustained earnings and profit of the corporation'], 1, 50, '🪙 Fin: "Absolutely. At the end of the decade, stock prices follow corporate earnings perfectly."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 6: UNDERSTANDING STOCKS
  -- ========================================

  -- LESSON: Diversification & Portfolio Basics
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Diversification & Portfolio Basics%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "Imagine putting your entire ₹5 Lakh life savings into a trendy EV startup stock. The CEO tweets something dumb, and the stock crashes 40%."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "How do you systematically avoid losing half your total net worth to a single bad CEO?"', ARRAY['Only safely buy Govt sector stocks!', 'Spread the allocated money widely across 20-30 different companies.'], 1, 20, '🪙 Fin: "Nailed it. That''s Diversification. If the giant banks fall, your FMCG stocks might hold steady acting as a shock-absorber."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "If one single heavily weighted stock falls, others may structurally remain stable or grow, perfectly balancing portfolio performance."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Is it completely Diversified? Swipe RIGHT for Yes, LEFT for No."', ARRAY['10 isolated tech stocks from Bangalore:left', 'A robust mix of IT, Pharma, and massive Banks:right', '100% locked into local real estate plots:left', 'Broad Nifty 50 Mutual Fund tracking the economy:right'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Concentration aggressively builds immense wealth, but Diversification rigorously protects it. Do not be a reckless hero with savings."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "Diversification strategically helps to fundamentally reduce:"', ARRAY['Severe concentration risk of a single monumental failure', 'The legal obligation to ever pay capital gains taxes'], 0, 50, '🪙 Fin: "Spot on. It removes the risk of one single point of failure destroying your entire timeline."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;

  -- ========================================
  -- MODULE 6: UNDERSTANDING STOCKS
  -- ========================================

  -- LESSON: Beginner Stock Mistakes
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title ILIKE '%Beginner Stock Mistakes%' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward, explanation) VALUES
    (v_lesson_id, 1, 'chat_reveal', '🪙 Fin: "A terrible stock fell 80%, so Ananya forcefully buys it heavily thinking ''It has to bounce back, right?''. Spoiler: It crashes to absolute zero."', NULL, NULL, 10, NULL),
    (v_lesson_id, 2, 'interactive_story', '🪙 Fin: "Your roommate buys a deeply sketchy penny stock because his uncle heard a rumor. He made an insane 40% yesterday. What do you do?"', ARRAY['Put my entire life savings in it immediately!', 'Ignore the chaotic noise. That is a pure FOMO trap.'], 1, 20, '🪙 Fin: "Right. FOMO is how the market legally extracts vast money from impatient people directly into the pockets of the patient."'),
    (v_lesson_id, 3, 'chat_reveal', '🪙 Fin: "Markets aggressively test emotional discipline on a daily basis. Acting on pure unadulterated fear or greed reliably creates massive unrecoverable losses."', NULL, NULL, 10, NULL),
    (v_lesson_id, 4, 'swipe_game', '🪙 Fin: "Swipe RIGHT for incredibly Smart moves, LEFT for classic beginner explosive traps."', ARRAY['Buying heavily based on unverified WhatsApp tips:left', 'Averaging down relentlessly on a visibly bankrupt company:left', 'Ignoring highly complex stocks you do not understand:right', 'Panic heavily selling everything during a global macro crash:left'], NULL, 30, NULL),
    (v_lesson_id, 5, 'chat_reveal', '🪙 Fin: "Core Rule: Have a heavily researched thesis completely mapped before strictly buying. Have a rigid exact exit plan meticulously mapped before selling."', NULL, NULL, 10, NULL),
    (v_lesson_id, 6, 'quiz', '🪙 Fin: "When should you confidently buy a singular company stock?"', ARRAY['When you rigorously understand its exact business model and complex financials', 'When it is trending virally #1 on Twitter'], 0, 50, '🪙 Fin: "Absolutely. Never invest blindly in a fundamental business you cannot simply explain to a 10 year old."'),
    (v_lesson_id, 7, 'reward', 'Lesson Completed!', NULL, NULL, 50, NULL);
  END IF;


END $$;
