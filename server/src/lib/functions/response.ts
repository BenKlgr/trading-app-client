import { ResponseMessage } from '../../types/ResponseMessage';

export function Ok(payload: any): ResponseMessage {
  return {
    ok: true,
    payload,
  };
}

export function Failure(errorMessage: string = ''): ResponseMessage {
  return {
    ok: false,
    errorMessage,
  };
}
