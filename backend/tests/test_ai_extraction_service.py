import unittest

from app.schemas.ai_extraction import ExtractionRequest
from app.services.ai_extraction_service import AIExtractionService


class AIExtractionServiceTests(unittest.TestCase):
    def test_normalize_response_fills_missing_fields(self) -> None:
        service = AIExtractionService.__new__(AIExtractionService)
        normalized = service.normalize_response({"customer_name": "Jane Doe"})

        self.assertEqual(normalized["customer_name"], "Jane Doe")
        self.assertEqual(normalized["product_name"], "")
        self.assertEqual(normalized["priority"], "")

    def test_empty_text_is_rejected(self) -> None:
        request = ExtractionRequest(text="   ", complaint_id=1)
        service = AIExtractionService.__new__(AIExtractionService)

        with self.assertRaises(Exception):
            service.validate_request(request)


if __name__ == "__main__":
    unittest.main()
