export const formatearMoneda = (valor) => {

    if (valor == null) return "$ 0";

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }
    ).format(valor);
};