--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: unified_verified_deal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unified_verified_deal (
    id integer NOT NULL,
    type character varying,
    "clientId" character varying,
    "providerId" character varying,
    "sectorId" character varying,
    "pieceCid" character varying,
    "pieceSize" numeric,
    "termMax" integer,
    "termMin" integer,
    "termStart" integer,
    "dealId" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "claimId" integer DEFAULT 0 NOT NULL
);


--
-- Name: unified_verified_deal_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unified_verified_deal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unified_verified_deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unified_verified_deal_id_seq OWNED BY public.unified_verified_deal.id;


--
-- Name: verified_client_allowance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verified_client_allowance (
    id integer NOT NULL,
    "addressId" character varying,
    "verifierAddressId" character varying,
    height integer,
    allowance numeric,
    "auditTrail" character varying,
    "msgCID" character varying,
    "issueCreateTimestamp" integer,
    "createMessageTimestamp" integer,
    retries integer DEFAULT 3 NOT NULL,
    error character varying DEFAULT ''::character varying NOT NULL,
    "usedAllowance" numeric DEFAULT '0'::numeric NOT NULL,
    "hasRemainingAllowance" boolean DEFAULT true NOT NULL,
    "allowanceTTD" integer,
    "isLdnAllowance" boolean DEFAULT false NOT NULL,
    "isFromAutoverifier" boolean DEFAULT false NOT NULL,
    "searchedByProposal" boolean DEFAULT false NOT NULL,
    "isEFilAllowance" boolean DEFAULT false NOT NULL,
    "issueCreator" character varying,
    "retrievalFrequency" character varying DEFAULT ''::character varying,
    "isDataPublic" character varying DEFAULT ''::character varying,
    "providerList" jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: verified_client_allowance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.verified_client_allowance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: verified_client_allowance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.verified_client_allowance_id_seq OWNED BY public.verified_client_allowance.id;


--
-- Name: unified_verified_deal id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unified_verified_deal ALTER COLUMN id SET DEFAULT nextval('public.unified_verified_deal_id_seq'::regclass);


--
-- Name: verified_client_allowance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verified_client_allowance ALTER COLUMN id SET DEFAULT nextval('public.verified_client_allowance_id_seq'::regclass);


--
-- Name: unified_verified_deal PK_76f56333d366aa67ac747861bde; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unified_verified_deal
    ADD CONSTRAINT "PK_76f56333d366aa67ac747861bde" PRIMARY KEY (id);


--
-- Name: verified_client_allowance PK_ab34ec6cc64a603d6d37ad80837; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verified_client_allowance
    ADD CONSTRAINT "PK_ab34ec6cc64a603d6d37ad80837" PRIMARY KEY (id);


--
-- Name: unified_verified_deal_clientid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unified_verified_deal_clientid_index ON public.unified_verified_deal USING btree ("clientId");


--
-- Name: unified_verified_deal_composed_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unified_verified_deal_composed_index ON public.unified_verified_deal USING btree ("clientId", "providerId", "pieceCid", "sectorId");


--
-- Name: unified_verified_deal_dealid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unified_verified_deal_dealid_index ON public.unified_verified_deal USING btree ("dealId");


--
-- Name: unified_verified_deal_providerid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unified_verified_deal_providerid_index ON public.unified_verified_deal USING btree ("providerId");


--
-- PostgreSQL database dump complete
--

