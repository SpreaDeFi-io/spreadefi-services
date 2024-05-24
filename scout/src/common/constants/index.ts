import 'dotenv/config';

export const RPC_URLS = {
  '42161': process.env.ARB_RPC,
  '10': process.env.OP_RPC,
  '8453': process.env.BASE_RPC,
  '59144': process.env.LINEA_RPC,
};

export const CRON_JOB_2H = '0 */2 * * *';
