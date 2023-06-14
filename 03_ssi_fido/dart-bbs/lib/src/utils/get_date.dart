import 'package:intl/intl.dart';

String getDate() {
  DateTime now = DateTime.now();
  DateFormat outputFormat = DateFormat('yyyy-MM-dd');
  String date = outputFormat.format(now);
  return date;
}
