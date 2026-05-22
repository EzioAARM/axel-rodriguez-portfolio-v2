import { Button, Column, Heading, Text } from "@once-ui-system/core";

export default function NotFoundPage() {
  return (
    <Column as="section" fillWidth flex={1} center paddingY="160" gap="l">
      <Text variant="display-strong-xl" onBackground="neutral-weak">
        404
      </Text>
      <Column horizontal="center" gap="s">
        <Heading variant="display-default-xs" align="center">
          Página no encontrada
        </Heading>
        <Text onBackground="neutral-weak" align="center">
          La página que buscas no existe o fue movida.
        </Text>
      </Column>
      <Button href="/" variant="secondary" arrowIcon>
        Volver al inicio
      </Button>
    </Column>
  );
}
