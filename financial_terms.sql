-- Create financial_terms table
CREATE TABLE IF NOT EXISTS financial_terms (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE financial_terms ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON financial_terms FOR SELECT USING (true);

-- Seed data for Word of the Day
INSERT INTO financial_terms (term, definition) VALUES
('Repo Rate', 'The rate at which the central bank of a country lends money to commercial banks.'),
('Inflation', 'The rate at which the general level of prices for goods and services is rising.'),
('Compound Interest', 'Interest calculated on the initial principal, which also includes all of the accumulated interest.'),
('Dividend', 'A distribution of a portion of a company''s earnings, decided by the board of directors, to a class of its shareholders.'),
('Equity', 'The value of an ownership interest in property, including shareholders'' equity in a business.'),
('Bear Market', 'A market condition in which the prices of securities are falling, and widespread pessimism causes the negative sentiment to be self-sustaining.'),
('Bull Market', 'A market condition in which prices are rising or are expected to rise.'),
('Asset', 'Anything of value that can be converted into cash.'),
('Liability', 'A company''s financial debt or obligations that arise during the course of its business operations.'),
('Diversification', 'A risk management strategy that mixes a wide variety of investments within a portfolio.'),
('Index Fund', 'A type of mutual fund with a portfolio constructed to match or track the components of a financial market index.'),
('Liquidity', 'The availability of liquid assets to a market or company.'),
('Capital Gain', 'An increase in the value of a capital asset (investment or real estate) that gives it a higher worth than the purchase price.'),
('Bond', 'A fixed income instrument that represents a loan made by an investor to a borrower (typically corporate or governmental).'),
('Stock', 'A type of security that signifies ownership in a corporation and represents a claim on part of the corporation''s assets and earnings.'),
('Mutual Fund', 'A type of financial vehicle made up of a pool of money collected from many investors to invest in securities like stocks, bonds, money market instruments, and other assets.'),
('ETF (Exchange Traded Fund)', 'A type of investment fund and exchange-traded product, i.e. they are traded on stock exchanges.'),
('ROI (Return on Investment)', 'A performance measure used to evaluate the efficiency of an investment or compare the efficiency of a number of different investments.'),
('FICO Score', 'A type of credit score created by the Fair Isaac Corporation.'),
('Net Worth', 'The value of all the non-financial and financial assets owned by an institutional unit or sector minus the value of all its outstanding liabilities.');
