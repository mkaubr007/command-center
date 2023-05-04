export class StatusCode {
  public static readonly SUCCESS_CODE_SERIES = Array(206 - 200 + 1)
    .fill(200)
    .map((x, y) => x + y);

  public static readonly ERROR_CODE_SERIES = Array(499 - 400 + 1)
    .fill(400)
    .map((x, y) => x + y);
}
