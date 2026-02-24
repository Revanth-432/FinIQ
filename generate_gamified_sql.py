import json

sql_template = """-- ========================================================
-- FINANCIAL LITERACY APP - GAMIFIED REALITY ENGINE MIGRATION
-- V1 - Indian Youth / Sarcastic Tone (Mascot: Fin)
-- FORMAT: Array Options Schema
-- ========================================================

DO $$
DECLARE
  v_lesson_id BIGINT;
BEGIN

  -- 1. NUKE OLD STATIC TEXT CARDS
  DELETE FROM public.cards;

{lessons_sql}

END $$;
"""

lesson_template = """  -- ========================================
  -- MODULE {module_idx}: {module_title}
  -- ========================================

  -- LESSON: {lesson_title}
  SELECT id INTO v_lesson_id FROM public.lessons WHERE title = '{db_title}' LIMIT 1;
  IF FOUND THEN
    INSERT INTO public.cards (lesson_id, order_index, type, content, options, correct_option_index, xp_reward) VALUES
{cards_sql};
  END IF;
"""

lessons = [
    {
        "m_idx": "1", "m_title": "DECODING THE MONEY MATRIX", "l_title": "Why High Income ≠ Wealth", "db_title": "Why High Income ≠ Wealth",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Meet Rahul. ₹12 LPA tech job in Bangalore, but orders Swiggy 3x a day and took an iPhone EMI."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "It's the 28th of the month. Take a wild guess: What is his bank balance?"''', "ARRAY['₹50,000 saved up', '₹152...']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Bingo. He is what we call 'Premium Broke'. Income is just your earning power. Wealth is the money you secretly keep."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Help Rahul figure out where his money goes. Swipe RIGHT for Needs, LEFT for Wants."''', "ARRAY['Rent:right', 'Goa Trip:left', 'Jordans:left', 'Groceries:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Pay Yourself First. The day your salary hits, hide 20% in an investment. Live on the rest."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What builds wealth faster?"''', "ARRAY['Earning a massive salary', 'Saving 20% before spending']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "1", "m_title": "DECODING THE MONEY MATRIX", "l_title": "Save vs Invest (Properly)", "db_title": "Save vs Invest (Properly)",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Priya keeps ₹5 Lakhs in her ICICI Savings account because 'it feels safe'. Bless her heart."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "What is her bank actually doing with that money?"''', "ARRAY['Keeping it safe in a vault', 'Lending it out at 12% and paying her 3%']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. The bank is getting rich off her cash. Savings accounts are for emergency funds, not wealth building."''', "NULL", "NULL", 10),
            ("slider_game", '''🪙 Fin: "If banks pay 3%, what is the realistic minimum return you should expect from good investments? Slide to guess!"''', "ARRAY['1', '15', '10']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Save for emergencies (FDs). Invest for growth (Equity/Mutual Funds). Know the difference."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the primary purpose of a standard savings account?"''', "ARRAY['Building massive wealth', 'Holding emergency liquid cash']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "1", "m_title": "DECODING THE MONEY MATRIX", "l_title": "Inflation is Silent Killer", "db_title": "Inflation is Silent Killer",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Remember when a plate of momos cost ₹30? Now it's ₹80. Your money is physically shrinking."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "If your money is locked in a cupboard for 10 years, what happens to its value?"''', "ARRAY['It drops by half', 'It stays the exact same']", "0", 20),
            ("chat_reveal", '''🪙 Fin: "Painful, right? That's Inflation. It silently eats 6-7% of your buying power every single year in India."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for things that BEAT inflation, LEFT for things killed by it."''', "ARRAY['Cash under mattress:left', 'Mutual Funds:right', 'Savings Account:left', 'Real Estate:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Your investments MUST generate more than 7% return, or you are literally getting poorer everyday."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the true cost of inflation?"''', "ARRAY['Prices go up, money buys less', 'It makes salaries look bigger']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "1", "m_title": "DECODING THE MONEY MATRIX", "l_title": "Rule of 72", "db_title": "Rule of 72",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Want the ultimate financial cheat code? It's called the Rule of 72. It feels like illegal magic."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "If you get a 12% return on a mutual fund, how long will it take to double your money?"''', "ARRAY['12 years', '6 years']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Yep. 72 divided by your return percentage (12) = 6 years to double. Simple math, massive gains."''', "NULL", "NULL", 10),
            ("slider_game", '''🪙 Fin: "If an FD gives you 6% interest, how many years to double? Slide!"''', "ARRAY['1', '20', '12']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Always divide 72 by the annual return rate to instantly know how many years it takes to double your cash."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "At a 9% return, how long to double your money?"''', "ARRAY['8 years', '9 years', '12 years']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "2", "m_title": "AVOIDING FINANCIAL SCAMS", "l_title": "Credit Cards & EMIs", "db_title": "Credit Cards & EMIs",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Ah, the Royal Enfield on EMI. The classic Indian youth trap. You feel like a king, until the bank calls."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "A credit card charges you 3.5% interest. Is that per year or per month?"''', "ARRAY['A sweet 3.5% per year', 'Per MONTH. Meaning 42% a year!']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "42% per year. Read that again. It's legal robbery. Only pay the 'Minimum Due' and you are trapped forever."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for smart credit use, LEFT for debt traps."''', "ARRAY['Paying in full monthly:right', 'Minimum payment only:left', 'Converting shoes to EMI:left', 'Using for reward points:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Credit cards are knives. Good for chopping veggies (rewards), deadly if you grab the blade (EMIs)."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What happens when you only pay the 'Minimum Due'?"''', "ARRAY['You build an insanely high interest debt trap', 'Your credit score shoots up']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "2", "m_title": "AVOIDING FINANCIAL SCAMS", "l_title": "Spotting Financial Scams", "db_title": "Spotting Financial Scams",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "'Bhai, just download this Telegram app, double your money in 25 days!'. Peak scam energy."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "A random WhatsApp group adds you and guarantees a daily 5% return on crypto. What do you do?"''', "ARRAY['Send them ₹10,000 to test it', 'Block, Report, Laugh']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Good. If someone knew how to double money in 25 days, they wouldn't share it with strangers on Telegram."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for Legit, LEFT for Scam flags."''', "ARRAY['Guaranteed zero-risk returns:left', 'SEBI Registered Advisor:right', 'Pay fees to unlock winnings:left', 'Transparent risk document:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: There are absolutely no guaranteed high returns in finance. If it sounds too good to be true, it is a lie."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the biggest red flag of a financial scam?"''', "ARRAY['Demanding you sign documents', 'Guaranteeing risk-free high returns']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Investing vs Trading vs Speculation", "db_title": "Investing vs Trading vs Speculation",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Watching a Finfluencer in a rented Lambo makes you wanna start F&O trading tomorrow. Huge mistake."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "You buy a stock hoping Elon Musk posts a tweet about it by Friday. Are you investing?"''', "ARRAY['Yes, I own the stock', 'No, that''s literal gambling (speculation)']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Correct. Investing = buying a solid business for years. Speculation = betting purely on price spikes and vibes."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for Investing, LEFT for Speculation/Trading."''', "ARRAY['Buying Index funds for 10 years:right', 'Buying options on expiry day:left', 'Buying dogecoin on a rumor:left', 'Analyzing company balance sheets:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: 90% of retail traders lose money. Start as an investor. Understand patience before chasing speed."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What drives long-term investing?"''', "ARRAY['Daily market trends and hype', 'Business fundamentals and time']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Goal-Based Investing Framework", "db_title": "Goal-Based Investing Framework",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Investing without a goal is like getting into a cab and saying 'just drive'. You will just waste gas."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "You need ₹2 Lakhs in exactly 6 months for college fees. Where do you put it?"''', "ARRAY['A high-risk small-cap stock', 'A boring, safe Liquid Fund or FD']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. The stock market is a rollercoaster. Don't put rent money on a rollercoaster."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Match the Timeline to the Risk. Swipe RIGHT for Long-Term (Stocks), LEFT for Short-Term (FD/Debt)."''', "ARRAY['Retirement in 20 years:right', 'Macbook to buy next month:left', 'House downpayment in 10 years:right', 'Emergency Fund:left']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Define Goal → Define Time → Define Risk → Pick Asset. Never reverse this order."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "Short-term money needed in 1 year should NEVER be put into:"''', "ARRAY['High-risk equity markets', 'Safe bank deposits']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Risk vs Return", "db_title": "Risk vs Return",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Your dad tells you FDs are the only safe way. Your gym bro tells you Crypto is the only fast way."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "If an investment promises a guaranteed 24% return per year, what is the actual risk level?"''', "ARRAY['Low risk, huge reward!', 'Extremely high risk of losing everything.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Spot on. Risk and Return are twins. You cannot get high returns without taking high risk. It defies physics."''', "NULL", "NULL", 10),
            ("slider_game", '''🪙 Fin: "Where do large-cap Indian stocks (Nifty 50) usually sit on a risk scale of 1 to 10?"''', "ARRAY['1', '10', '6']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Never take more risk than your heart can handle, and never take less risk than inflation demands."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the relationship between Risk and Return?"''', "ARRAY['High risk usually means high potential return', 'High risk always guarantees profit']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Stocks & Mutual Funds", "db_title": "Stocks & Mutual Funds",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Buying individual stocks is like cooking a 5-course meal yourself. Buying a Mutual Fund is like ordering a thali at a restaurant."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "You have ₹5,000. Do you buy 1 share of an expensive IT company, or a Mutual Fund?"''', "ARRAY['1 share. I am a master trader.', 'Mutual fund. I want a slice of 50 companies.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. The fund manager basically takes your ₹5k, mixes it with others, and buys the whole market for you."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for Mutual Funds, LEFT for Individual Stocks."''', "ARRAY['Requires deep daily research:left', 'Auto-diversified:right', 'Zero effort SIPs:right', 'Very high concentration risk:left']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: If you don't have 10 hours a week to read balance sheets, stick to Index and Mutual Funds. Let the pros cook."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What makes Mutual Funds ideal for beginners?"''', "ARRAY['Instant diversification and professional management', 'Guaranteed higher returns than stocks']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Time Horizon & Risk Capacity", "db_title": "Time Horizon & Risk Capacity",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Two investors buy the same mutual fund. One panics and sells at a loss after 3 months. The other wins big after 5 years. Same fund, different Time Horizon."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "You need to pay your MBA fee in 6 months. Where do you park the ₹3 Lakhs?"''', "ARRAY['Small-cap equity funds for maximum growth!', 'Safe, boring Liquid Fund or FD.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. If you desperately need the money soon, your risk capacity is mathematically ZERO. Don't gamble it."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Match the Timeline: Swipe RIGHT for 5+ Years (Equity), LEFT for <1 Year (Debt)."''', "ARRAY['Buying a house next decade:right', 'Rent due next week:left', 'Retirement fund:right', 'Emergency medical fund:left']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Money needed in <3 years goes to Debt/FDs. Money needed in 5+ years goes to Equity."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "Short-term goals require:"''', "ARRAY['High stability and low risk', 'High volatility and growth']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "4", "m_title": "INVESTING FOUNDATIONS", "l_title": "Asset Classes Explained Clearly", "db_title": "Asset Classes Explained Clearly",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Think of your portfolio like a cricket team. You need aggressive batsmen (Equity) and reliable bowlers (Debt)."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "If the stock market crashes entirely, what asset class usually remains stable or goes up to protect you?"''', "ARRAY['More Stocks', 'Gold & Debt (Bonds)']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Spot on. Gold is the defensive shield. Debt is the stable anchor. Equity is the engine."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Identify the Asset Class: Swipe RIGHT for Equity (Growth), LEFT for Debt (Stability)."''', "ARRAY['Government Bonds:left', 'Nifty 50 Shares:right', 'Fixed Deposits:left', 'Startup Investing:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: A healthy portfolio mixes different asset classes so if one crashes, the others keep you alive."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the primary role of Debt in a portfolio?"''', "ARRAY['Maximum explosive growth', 'Stability and capital protection']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "5", "m_title": "SIP & MUTUAL FUNDS", "l_title": "What is SIP & How It Works", "db_title": "What is SIP & How It Works",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "You don't need crores to get rich. You just need ₹5,000, automation, and 15 years to ignore the noise."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "The market crashes 15% today. Your automated monthly SIP is scheduled tomorrow. What do you do?"''', "ARRAY['Pause it out of fear!', 'Let it execute. I''m buying on discount.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Nailed it. That's Rupee Cost Averaging. You automatically buy more units when the market is cheap. Pure math, zero emotion."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for SIP mentalities, LEFT for Trading mentalities."''', "ARRAY['Checking portfolio every 10 mins:left', 'Automating payments on the 5th:right', 'Panic selling on news:left', 'Holding through market dips:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Automate your SIP. Treat it like a strict EMI you owe to your future self."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What happens during an SIP when markets fall?"''', "ARRAY['You buy fewer units at high prices', 'You accumulate more units at cheaper prices']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "5", "m_title": "SIP & MUTUAL FUNDS", "l_title": "Types of Mutual Funds", "db_title": "Types of Mutual Funds",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Saying 'I invest in mutual funds' is like saying 'I eat food'. Are you eating dal rice (Index Funds) or spicy extreme junk food (Sectoral Funds)?"''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "You want a completely passive fund that just copies the top 50 companies in India with super low fees. What do you buy?"''', "ARRAY['An active mid-cap fund', 'A Nifty 50 Index Fund!']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Boom. Index funds are the undisputed kings for lazy investors. High active fund fees secretly eat your wealth over 20 years."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Categorize the Funds: Swipe RIGHT for High Risk (Equity), LEFT for Low Risk (Debt)."''', "ARRAY['Small Cap Fund:right', 'Liquid Fund:left', 'Corporate Bond Fund:left', 'Sectoral Tech Fund:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Match the fund type to your goal. Don't buy a high-risk small-cap fund just because it gave 40% last year."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the main advantage of an Index Fund?"''', "ARRAY['Extremely low fees and passive market tracking', 'Guaranteed higher returns than any other fund']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "5", "m_title": "SIP & MUTUAL FUNDS", "l_title": "Power of Staying Invested", "db_title": "Power of Staying Invested",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "March 2020: A pandemic hits. The market crashes 30%. Millions panic sold their mutual funds and locked in their losses."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "What did the smart investors do during that massive scary 30% crash?"''', "ARRAY['They bought MORE at a heavy 30% discount', 'They sold everything to save cash.']", "0", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. By 2021, the market made a massive V-shape recovery. The panic sellers cried. The patient holders got rich."''', "NULL", "NULL", 10),
            ("slider_game", '''🪙 Fin: "On average, how many days realistically does a stock market 'correction' last before recovering? Slide to guess!"''', "ARRAY['10', '300', '120']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Volatility is the invisible fee you pay for market growth. If you can't handle the drops, you don't deserve the gains."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "Panic selling during a market crash primarily results in:"''', "ARRAY['Locking in permanent losses', 'Protecting long-term capital']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "5", "m_title": "SIP & MUTUAL FUNDS", "l_title": "Common SIP Mistakes", "db_title": "Common SIP Mistakes",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "90% of people start an SIP in January, get bored by June, and stop it. Absolute tragic behavior."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "Your friend says: 'My SIP gave -2% this year, mutual funds are a scam'. You reply:"''', "ARRAY['Yeah bro, let''s do crypto', 'It''s a 10-year game, stop crying over 1 year.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Exactly. SIPs require time to compound. Checking it daily is like pulling up a plant to see if roots are growing."''', "NULL", "NULL", 10),
            ("slider_game", '''🪙 Fin: "Slide to guess: How many years does compounding actually start creating visible magic in a portfolio?"''', "ARRAY['1', '15', '7']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Never pause an SIP during a market crash. That is literally the best time it executes."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "What is the most common reason SIPs fail to build wealth?"''', "ARRAY['The investor stops it impatiently within 2 years', 'The stock market runs out of money']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "6", "m_title": "UNDERSTANDING STOCKS", "l_title": "Long-Term vs Short-Term", "db_title": "Long-Term vs Short-Term",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Everyone thinks the stock market is a casino. It’s actually a weighing machine... if you wait long enough."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "A company's profit doubles over 5 years. But the stock price drops 5% this week because of election news. What matters more?"''', "ARRAY['The election news! Sell!', 'The massive profit doubling.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Spot on. Short term is driven by wild emotions and headlines. Long term is driven strictly by business profit."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for Long-Term Investor actions, LEFT for Short-Term panic."''', "ARRAY['Selling because Twitter is panicking:left', 'Holding because revenue grew 15%:right', 'Buying because of a random hot tip:left', 'Researching a company''s debt:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: If you aren't willing to hold a stock for 10 years, don't even think about owning it for 10 minutes."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "In the long term, stock prices primarily follow:"''', "ARRAY['News anchors shouting on TV', 'The actual earnings and profit of the business']", "1", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "6", "m_title": "UNDERSTANDING STOCKS", "l_title": "Beginner Stock Mistakes", "db_title": "Beginner Stock Mistakes",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "A stock fell 80%, so Ananya buys it thinking 'It has to bounce back, right?'. Spoiler: It goes to zero."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "Your roommate buys a sketchy penny stock because his uncle heard a rumor. He made 40% yesterday. What do you do?"''', "ARRAY['Put my entire savings in it!', 'Ignore the noise. That''s FOMO trap.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Right. FOMO (Fear of Missing Out) is how the market legally extracts money from impatient people into the pockets of patient people."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Swipe RIGHT for Smart moves, LEFT for classic beginner traps."''', "ARRAY['Buying based on WhatsApp tips:left', 'Averaging down a bankrupt company:left', 'Ignoring stocks you don''t understand:right', 'Panic selling during a global crash:left']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Have a thesis before buying. Have an exit plan before selling. Stop following the herd blindly."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "When should you buy a stock?"''', "ARRAY['When you understand its business and financials', 'When it is trending on Twitter']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    },
    {
        "m_idx": "6", "m_title": "UNDERSTANDING STOCKS", "l_title": "Diversification Basics", "db_title": "Diversification Basics",
        "cards": [
            ("chat_reveal", '''🪙 Fin: "Imagine putting your entire ₹5 Lakh savings into a trendy EV startup stock. The CEO tweets something dumb, and the stock crashes 40% in a day."''', "NULL", "NULL", 10),
            ("interactive_story", '''🪙 Fin: "How do you avoid losing half your net worth to a single bad CEO?"''', "ARRAY['Only buy PSU (Govt) stocks!', 'Spread the money across 20-30 different companies.']", "1", 20),
            ("chat_reveal", '''🪙 Fin: "Nailed it. That's Diversification. If the banks fall, your FMCG stocks might hold steady. It acts as shock-absorber for your portfolio."''', "NULL", "NULL", 10),
            ("swipe_game", '''🪙 Fin: "Is it Diversified? Swipe RIGHT for Yes, LEFT for No."''', "ARRAY['10 tech stocks from Bangalore:left', 'A mix of IT, Pharma, and Banks:right', '100% in local real estate:left', 'Nifty 50 Mutual Fund:right']", "NULL", 30),
            ("chat_reveal", '''🪙 Fin: "Core Rule: Concentration builds immense wealth, but Diversification protects it. Do not be a hero with your life savings."''', "NULL", "NULL", 10),
            ("quiz", '''🪙 Fin: "Diversification mainly reduces:"''', "ARRAY['Concentration risk of a single failure', 'The need to ever pay taxes']", "0", 50),
            ("reward", '''Lesson Completed!''', "NULL", "NULL", 50)
        ]
    }
]

all_lessons_sql = []
for lesson_data in lessons:
    cards_sql_lines = []
    
    for idx, card in enumerate(lesson_data["cards"]):
        order_index = idx + 1
        c_type, content, options, correct_index, xp = card
        
        # Format the values line
        line = f"    (v_lesson_id, {order_index}, '{c_type}', '{content}', {options}, {correct_index}, {xp})"
        cards_sql_lines.append(line)
    
    cards_sql_str = ",\n".join(cards_sql_lines)
    
    ls_sql = lesson_template.format(
        module_idx=lesson_data["m_idx"],
        module_title=lesson_data["m_title"],
        lesson_title=lesson_data["l_title"],
        db_title=lesson_data["db_title"],
        cards_sql=cards_sql_str
    )
    all_lessons_sql.append(ls_sql)

# Writing to the python string logic, don't execute it, just output it to a new sql string
final_sql = sql_template.format(lessons_sql="\n".join(all_lessons_sql))

with open("gamified_migration_v1.sql", "w", encoding="utf-8") as f:
    f.write(final_sql)

print("gamified_migration_v1.sql generated successfully!")
