import 'package:plr_console/plr_console.dart';

const _plrPrefix = "plr";

String createFidoId(Channel channel) =>
  "${_plrPrefix}:${channel.plrId!.toString()}:${channel.id!}";
