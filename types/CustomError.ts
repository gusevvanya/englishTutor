type ErrorItem = {
  reason: string;
  message: string;
};

type CustomError = ErrorItem | ErrorItem[];

export default CustomError;
