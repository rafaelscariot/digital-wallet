import { isPayloadValid } from '@shared/util';
import { suite, test } from '@testdeck/jest';

@suite('[Shared Module] Payload Validator Unit Test')
class PayloadValidatorUnitTest {
  private payload = JSON.stringify({ amount: 1, walletId: 1 });

  @test
  'Given a valid JSON, should return true'() {
    const result = isPayloadValid(this.payload);
    expect(result).toBeTruthy();
  }

  @test
  'Given an invalid JSON, should return false'() {
    const result = isPayloadValid([].toString());
    expect(result).toBeFalsy();
  }
}
