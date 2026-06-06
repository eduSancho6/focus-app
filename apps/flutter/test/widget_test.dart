import 'package:flutter_test/flutter_test.dart';
import 'package:focus_flutter/main.dart';

void main() {
  testWidgets('App renders home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const FocusApp());
    expect(find.text('Focus App'), findsOneWidget);
  });
}
